// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import 'solidity-json-writer/contracts/JsonWriter.sol';
import 'base64-sol/base64.sol';

/// @title Tokenized time collection
/// @notice Everything created can change a lot, we are still building it.
/// @dev Everything
contract TimeCollection is IERC2981, ERC721, Ownable {
    using SafeERC20 for IERC20;
    using JsonWriter for JsonWriter.Json;

    event TokenBought(uint256 indexed tokenId, address seller, address buyer);
    event TokenPriceChanged(uint256 indexed tokenId, uint256 newPrice);
    event TokenForSaleToggled(uint256 indexed tokenId);
    event CurrencyAllowanceToggled(address indexed currency);

    error TokenDoesntExist(uint256 tokenId);
    error OnlyTokenOwner(uint256 tokenId);
    error InvalidAddress(address addr);
    error NotForSale(uint256 tokenId);
    error CantBuyYourOwnToken(address buyer, uint256 tokenId);
    error NotEnoughFunds(uint256 tokenId);
    error AlreadyRedeemed(uint256 tokenId);
    error UnallowedCurrency(uint256 tokenId, address currency);
    error TransferFailed();
    error InvalidRoyalty();

    struct Token {
        uint256 tokenId;
        uint256 price;
        uint256 royalty;
        string name;
        string description;
        string work;
        string time;
        string date;
        bool redeemed;
        bool forSale;
        address payable mintedBy;
        address currency;
    }

    uint256 internal _tokenCounter;
    uint16 internal constant BASIS_POINTS = 10000;

    modifier onlyExistingTokenId(uint256 tokenId) {
        if (!_exists(tokenId)) revert TokenDoesntExist(tokenId);
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (msg.sender != ownerOf(tokenId)) revert OnlyTokenOwner(tokenId);
        _;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => bool) public isCurrencyAllowed;

    /// @dev Constructor of the contract
    /// @param name Collection name
    /// @param symbol Collection symbol
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenCounter = 0;
    }

    /// @dev Mints a new token with the given parameters.
    /// @param name Name of the NFT that you are minting
    /// @param description Description of the NFT that you are minting
    /// @param work Type of work that will be done of the NFT that you are minting
    /// @param time Units of time to be redeemed of the NFT that you are minting
    /// @param date Date of when the NFT will be redeemed of the NFT that you are minting
    /// @param royalty The royalty that you will keep as a minter as a fraction of 10000
    function mint(
        string memory name,
        string memory description,
        string memory work,
        string memory time,
        string memory date,
        uint256 royalty
    ) external {
        if (royalty > BASIS_POINTS) revert InvalidRoyalty();
        _safeMint(msg.sender, _tokenCounter);
        Token memory newToken = Token(
            _tokenCounter,
            0,
            royalty,
            name,
            description,
            work,
            time,
            date,
            false,
            false,
            payable(msg.sender),
            address(0)
        );
        tokens[_tokenCounter] = newToken;
        _tokenCounter++;
    }

    /// @dev Buys the token with the given tokenId.
    /// @param tokenId The token id of the NFT that you are buying
    function buyToken(uint256 tokenId) external payable onlyExistingTokenId(tokenId) {
        if (msg.sender == address(0)) revert InvalidAddress(msg.sender);
        address payable owner = payable(ownerOf(tokenId));
        if (owner == msg.sender) revert CantBuyYourOwnToken(msg.sender, tokenId);
        Token memory token = tokens[tokenId];
        if (!isCurrencyAllowed[token.currency]) revert UnallowedCurrency(tokenId, token.currency);
        if (!token.forSale) revert NotForSale(tokenId);
        if (IERC20(token.currency).balanceOf(msg.sender) < token.price) revert NotEnoughFunds(tokenId);
        token.forSale = false;
        tokens[tokenId] = token;
        _transfer(owner, msg.sender, tokenId);
        if (owner != token.mintedBy) {
            uint256 royaltyAmount = (token.price * token.royalty) / BASIS_POINTS;
            _transferCurrency(msg.sender, token.mintedBy, token.currency, royaltyAmount);
            _transferCurrency(msg.sender, owner, token.currency, token.price - royaltyAmount);
        } else {
            _transferCurrency(msg.sender, owner, token.currency, token.price);
        }
        emit TokenBought(tokenId, owner, msg.sender);
    }

    /// @dev Changes the price and currency of the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are selling
    /// @param currency The address of the ERC-20 currency to use for the payment. Use address(0) to set native currency
    /// @param price Price of the NFT that you are selling
    function changeTokenBuyingConditions(
        uint256 tokenId,
        address currency,
        uint256 price
    ) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        if (!isCurrencyAllowed[currency]) revert UnallowedCurrency(tokenId, currency);
        Token memory token = tokens[tokenId];
        token.price = price;
        token.currency = currency;
        tokens[tokenId] = token;
    }

    /// @dev Redeems the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are redeeming
    function redeem(uint256 tokenId) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        Token memory token = tokens[tokenId];
        if (token.redeemed) revert AlreadyRedeemed(tokenId);
        token.redeemed = true;
        tokens[tokenId] = token;
    }

    /// @dev Toggles the for sale status of the token with the given tokenId.
    /// @param tokenId The number of rings from dendrochronological sample
    function toggleForSale(uint256 tokenId)
        external
        onlyExistingTokenId(tokenId)
        onlyTokenOwner(tokenId)
    {
        Token memory token = tokens[tokenId];
        if (!token.forSale && !isCurrencyAllowed[token.currency]) {
            revert UnallowedCurrency(tokenId, token.currency);
        }
        token.forSale = !token.forSale;
        tokens[tokenId] = token;
        emit TokenForSaleToggled(tokenId);
    }

    /// @dev Gets the royalty information of the token with the given tokenId.
    /// @param tokenId The id of the token that you are checking
    /// @param salePrice The price of the NFT that should be used for royalty calculation
    /// @return The address who will receive the royalties and the royalty amount for the given price
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        onlyExistingTokenId(tokenId)
        returns (address, uint256)
    {
        return (tokens[tokenId].mintedBy, (salePrice * tokens[tokenId].royalty) / BASIS_POINTS);
    }

    /// @dev Checks if the contract supports the specified interface.
    /// @param interfaceId The interface id of the interface that you are querying
    /// @return True if the interface is supported, false otherwise
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @dev Returns the URI of the token with the given tokenId.
    /// @param tokenId Token Id of the NFT that you are getting the URI
    /// @return encoded token data in json format
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        Token memory token = tokens[tokenId];
        JsonWriter.Json memory writer;

        writer = writer.writeStartObject();

        writer = writer.writeStringProperty('name', token.name);
        writer = writer.writeStringProperty('description', token.description);

        writer = writer.writeStartArray('attributes');

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty('trait_type', 'type');
        writer = writer.writeStringProperty('value', token.work);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty('trait_type', 'Number of Hours');
        writer = writer.writeStringProperty('value', token.time);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty('trait_type', 'Date');
        writer = writer.writeStringProperty('value', token.date);
        writer = writer.writeEndObject();

        writer = writer.writeEndArray();

        writer = writer.writeEndObject();

        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(bytes(writer.value))
                )
            );
    }

    /// @dev Toggles the payment allowance of the given currency
    /// @param currency The address of the ERC-20 currency to toggle allowance. Use address(0) for native currency
    function toggleCurrencyAllowance(address currency) external onlyOwner {
        isCurrencyAllowed[currency] = !isCurrencyAllowed[currency];
        emit CurrencyAllowanceToggled(currency);
    }

    /// @dev Transfers the given amount of the given currency from sender to receiver
    /// @param sender The address of who will send the transfer
    /// @param receiver The address of who will receive the transfer
    /// @param currency The currency to use for the transfer. Use address(0) for native currency
    /// @param amount The amount to transfer
    function _transferCurrency(
        address sender,
        address payable receiver,
        address currency,
        uint256 amount
    ) internal {
        if (currency == address(0)) {
            (bool transferSucceed, ) = receiver.call{value: amount}('');
            if (!transferSucceed) revert TransferFailed();
        } else {
            IERC20(currency).safeTransferFrom(sender, receiver, amount);
        }
    }
}
