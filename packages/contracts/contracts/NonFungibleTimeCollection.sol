// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import './interfaces/ISvgGenerator.sol';
import 'base64-sol/base64.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';

/// @title Non-Fungible Time collection
/// @author The Newt team
/// @notice A primitive to mint time, our most valuable asset, on-chain
/// @dev An ERC-721 contract with mint, buy, and transfer functions
contract NonFungibleTimeCollection is IERC2981, ERC721Upgradeable, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    event TokenBought(uint256 indexed tokenId, address seller, address buyer);
    event TokenBuyingConditionsChanged(
        uint256 indexed tokenId,
        address currency,
        uint256 price,
        address allowedBuyer,
        bool forSale
    );
    event TokenRoyaltyReceiverChanged(uint256 indexed tokenId, address royaltyReceiver);
    event TokenRedeemed(uint256 indexed tokenId);
    event CurrencyAllowanceToggled(address indexed currency);
    event SvgGeneratorSet(address indexed svgGenerator);

    error TokenDoesNotExist(uint256 tokenId);
    error OnlyTokenOwner(uint256 tokenId);
    error OnlyCurrentRoyaltyReceiver(uint256 tokenId);
    error NotForSale(uint256 tokenId);
    error UnauthorizedBuyer(address buyer, uint256 tokenId);
    error CanNotBuyYourOwnToken(address buyer, uint256 tokenId);
    error AlreadyRedeemed(uint256 tokenId);
    error UnallowedCurrency(uint256 tokenId, address currency);
    error TransferFailed();
    error InvalidRoyalty();
    error InvalidTimeParams();

    struct Token {
        uint256 availabilityFrom;
        uint256 availabilityTo;
        uint256 duration;
        uint256 price;
        uint256 royaltyBasisPoints;
        address payable royaltyReceiver;
        address currency;
        address allowedBuyer;
        bool redeemed;
        bool forSale;
        string name;
        string description;
        string category;
    }

    uint256 internal _tokenCounter;
    uint16 internal constant BASIS_POINTS = 10000;

    modifier onlyExistingTokenId(uint256 tokenId) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist(tokenId);
        }
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (msg.sender != ownerOf(tokenId)) {
            revert OnlyTokenOwner(tokenId);
        }
        _;
    }

    address public svgGenerator;
    mapping(uint256 => Token) public tokens;
    mapping(address => bool) public isCurrencyAllowed;

    /// @dev Initializer of the contract.
    /// @param name Collection name.
    /// @param symbol Collection symbol.
    /// @param useNativeCurrency Flag to enable native currency from the beginning.
    /// @param svgGeneratorContract The address of a contract following the ISvgGenerator interface.
    /// @param owner The owner of the contract, who will be able to execute onlyOwner functions.
    function initialize(
        string memory name,
        string memory symbol,
        bool useNativeCurrency,
        address svgGeneratorContract,
        address owner
    ) public initializer {
        __ERC721_init(name, symbol);
        _transferOwnership(owner);
        if (useNativeCurrency) {
            isCurrencyAllowed[address(0)] = true;
        }
        svgGenerator = svgGeneratorContract;
    }

    /// @dev Mints a new token with the given parameters.
    /// @param name Name of the NFT that you are minting.
    /// @param description Description of the NFT that you are minting.
    /// @param category Type or category label that represents the activity for what the time is being tokenized.
    /// @param availabilityFrom Unix timestamp indicating start of availability. Zero if does not have lower bound.
    /// @param availabilityTo Unix timestamp indicating end of availability. Zero if does not have upper bound.
    /// @param duration The actual quantity of time you are tokenizing inside availability range. Measured in seconds.
    /// @param royaltyBasisPoints The royalty percentage measured in basis points. Each basis point represents 0.01%.
    /// @return An integer representing the ID of the minted NFT.
    function mint(
        string memory name,
        string memory description,
        string memory category,
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration,
        uint256 royaltyBasisPoints
    ) external returns (uint256) {
        if (royaltyBasisPoints > BASIS_POINTS) {
            revert InvalidRoyalty();
        }
        if (!_areValidTimeParams(availabilityFrom, availabilityTo, duration)) {
            revert InvalidTimeParams();
        }
        _safeMint(msg.sender, _tokenCounter);
        Token memory newToken = Token(
            availabilityFrom,
            availabilityTo,
            duration,
            0,
            royaltyBasisPoints,
            payable(msg.sender),
            address(0),
            address(0),
            false,
            false,
            name,
            description,
            category
        );
        tokens[_tokenCounter] = newToken;
        return _tokenCounter++;
    }

    /// @dev Buys the token with the given tokenId.
    /// @param tokenId The token id of the NFT that you are buying.
    function buy(uint256 tokenId) external payable onlyExistingTokenId(tokenId) {
        address payable owner = payable(ownerOf(tokenId));
        if (owner == msg.sender) {
            revert CanNotBuyYourOwnToken(msg.sender, tokenId);
        }
        Token memory token = tokens[tokenId];
        if (!isCurrencyAllowed[token.currency]) {
            revert UnallowedCurrency(tokenId, token.currency);
        }
        if (!token.forSale) {
            revert NotForSale(tokenId);
        }
        if (token.allowedBuyer != address(0) && msg.sender != token.allowedBuyer) {
            revert UnauthorizedBuyer(msg.sender, tokenId);
        }
        token.forSale = false;
        tokens[tokenId] = token;
        _transfer(owner, msg.sender, tokenId);
        if (owner != token.royaltyReceiver) {
            uint256 royaltyAmount = (token.price * token.royaltyBasisPoints) / BASIS_POINTS;
            _transferCurrency(msg.sender, token.royaltyReceiver, token.currency, royaltyAmount);
            _transferCurrency(msg.sender, owner, token.currency, token.price - royaltyAmount);
        } else {
            _transferCurrency(msg.sender, owner, token.currency, token.price);
        }
        emit TokenBought(tokenId, owner, msg.sender);
    }

    /// @dev Changes the price and currency of the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are selling.
    /// @param currency The address of the ERC-20 currency to use for the payment. Use address(0) to set native currency.
    /// @param price Price of the NFT that you are selling.
    /// @param allowedBuyer address of the buyer to avoid frontruns. Use address(0) to enable everyone to buy the NFT.
    /// @param forSale A boolean indicating if the NFT is for sale or not.
    function changeBuyingConditions(
        uint256 tokenId,
        address currency,
        uint256 price,
        address allowedBuyer,
        bool forSale
    ) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        if (!isCurrencyAllowed[currency]) {
            revert UnallowedCurrency(tokenId, currency);
        }
        Token memory token = tokens[tokenId];
        token.price = price;
        token.currency = currency;
        token.forSale = forSale;
        token.allowedBuyer = allowedBuyer;
        tokens[tokenId] = token;
        emit TokenBuyingConditionsChanged(tokenId, currency, price, allowedBuyer, forSale);
    }

    /// @dev Changes the token royalty receiver.
    /// @param tokenId Token id of the NFT which royalty receiver must be updated.
    /// @param royaltyReceiver The address of the new rotalty receiver.
    function changeRoyaltyReceiver(uint256 tokenId, address royaltyReceiver)
        external
        onlyExistingTokenId(tokenId)
    {
        if (msg.sender != tokens[tokenId].royaltyReceiver) {
            revert OnlyCurrentRoyaltyReceiver(tokenId);
        }
        tokens[tokenId].royaltyReceiver = payable(royaltyReceiver);
        emit TokenRoyaltyReceiverChanged(tokenId, royaltyReceiver);
    }

    /// @dev Redeems the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are redeeming.
    function redeem(uint256 tokenId) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        Token memory token = tokens[tokenId];
        if (token.redeemed) {
            revert AlreadyRedeemed(tokenId);
        }
        token.redeemed = true;
        tokens[tokenId] = token;
        emit TokenRedeemed(tokenId);
    }

    /// @dev Toggles the payment allowance of the given currency.
    /// @param currency The address of the ERC-20 currency to toggle allowance. Use address(0) for native currency.
    function toggleCurrencyAllowance(address currency) external onlyOwner {
        isCurrencyAllowed[currency] = !isCurrencyAllowed[currency];
        emit CurrencyAllowanceToggled(currency);
    }

    /// @dev Sets the SVG generator for the NFT image.
    /// @param newSvgGenerator The address of a contract following the ISvgGenerator signature.
    function setSvgGenerator(address newSvgGenerator) external onlyOwner {
        svgGenerator = newSvgGenerator;
        emit SvgGeneratorSet(newSvgGenerator);
    }

    /// @dev Gets the royalty information of the token with the given tokenId.
    /// @param tokenId The id of the token that you are checking.
    /// @param salePrice The price of the NFT that should be used for royalty calculation.
    /// @return The address who will receive the royalties and the royalty amount for the given price.
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        onlyExistingTokenId(tokenId)
        returns (address, uint256)
    {
        return (
            tokens[tokenId].royaltyReceiver,
            (salePrice * tokens[tokenId].royaltyBasisPoints) / BASIS_POINTS
        );
    }

    /// @dev Checks if the contract supports the specified interface.
    /// @param interfaceId The interface id of the interface that you are querying.
    /// @return True if the interface is supported, false otherwise.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @dev Returns the URI of the token with the given tokenId.
    /// @param tokenId Token Id of the NFT that you are getting the URI.
    /// @return Base64-encoded token metadata.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        Token memory token = tokens[tokenId];
        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        abi.encodePacked(
                            _getTokenURIBeforeImage(token.name, token.description),
                            Base64.encode(
                                bytes(
                                    ISvgGenerator(svgGenerator).generateSvg(
                                        token.redeemed,
                                        token.category
                                    )
                                )
                            ),
                            _getTokenURIAfterImage(
                                token.category,
                                token.availabilityFrom,
                                token.availabilityTo,
                                token.duration,
                                token.redeemed
                            )
                        )
                    )
                )
            );
    }

    /// @dev Generates the string with the initial part of the token URI that goes before the image.
    /// @param name Name of the NFT that you are minting.
    /// @param description Description of the NFT that you are minting.
    /// @return Bytes representing the initial part of the token URI.
    function _getTokenURIBeforeImage(string memory name, string memory description)
        internal
        pure
        returns (bytes memory)
    {
        return
            abi.encodePacked(
                '{"name":"',
                name,
                '","description":"',
                description,
                '","image":"',
                'data:image/svg+xml;base64,'
            );
    }

    /// @dev Generates the string with the final part of the token URI that goes after the image.
    /// @param category Type or category label that represents the activity for what the time is being tokenized.
    /// @param availabilityFrom Unix timestamp indicating start of availability. Zero if does not have lower bound.
    /// @param availabilityTo Unix timestamp indicating end of availability. Zero if does not have upper bound.
    /// @param duration The actual quantity of time you are tokenizing inside availability range. Measured in seconds.
    /// @param redeemed A boolean representing if the token is redeemed or not.
    /// @return Bytes representing with the final part of the token URI.
    function _getTokenURIAfterImage(
        string memory category,
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration,
        bool redeemed
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '","attributes":[{"trait_type":"Type","value":"',
                category,
                '"},{"display_type":"date","trait_type":"Availability from","value":"',
                Strings.toString(availabilityFrom),
                '"},{"display_type":"date","trait_type":"Availability To","value":"',
                Strings.toString(availabilityTo),
                '"},{"trait_type":"Duration","value":"',
                Strings.toString(duration),
                '"},{"trait_type":"Redeemed","value":"',
                _boolToString(redeemed),
                '"}]}'
            );
    }

    /// @dev Converts the given boolean value to its human-friendly string representation.
    /// @param boolean The boolean value to convert.
    /// @return The corresponding string representation of the given boolean value.
    function _boolToString(bool boolean) internal pure returns (string memory) {
        return boolean ? 'True' : 'False';
    }

    /// @dev Transfers the given amount of the given currency from sender to receiver.
    /// @param sender The address of who will send the transfer.
    /// @param receiver The address of who will receive the transfer.
    /// @param currency The currency to use for the transfer. Use address(0) for native currency.
    /// @param amount The amount to transfer.
    function _transferCurrency(
        address sender,
        address payable receiver,
        address currency,
        uint256 amount
    ) internal {
        if (currency == address(0)) {
            (bool transferSucceeded, ) = receiver.call{value: amount}('');
            if (!transferSucceeded) {
                revert TransferFailed();
            }
        } else {
            IERC20(currency).safeTransferFrom(sender, receiver, amount);
        }
    }

    /// @dev Tells whether the given params conform a valid time representation or not. To be valid must follow:
    ///     - Duration is greater than zero.
    ///     - If the availability range is bounded on both ends then:
    ///         * availabilityTo is greater than availabilityFrom
    ///         * duration is less or equal than availabilityTo - availabilityFrom
    /// @param availabilityFrom Unix timestamp indicating start of availability. Zero if does not have lower bound.
    /// @param availabilityTo Unix timestamp indicating end of availability. Zero if does not have upper bound.
    /// @param duration The actual quantity of time tokenized inside availability range. Measured in seconds.
    /// @return True if given params are a valid time representation, false otherwise.
    function _areValidTimeParams(
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration
    ) internal pure returns (bool) {
        return
            duration != 0 &&
            ((availabilityFrom == 0 || availabilityTo == 0) ||
                (availabilityTo > availabilityFrom &&
                    duration <= availabilityTo - availabilityFrom));
    }
}
