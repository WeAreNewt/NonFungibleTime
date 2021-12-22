// SPDX-License-Identifier: Undefined
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "base64-sol/base64.sol";

/// @title Tokenized time collection
/// @notice Everything created can change a lot, we are still building it.
/// @dev Everything
contract TimeCollection is IERC2981, ERC721, Ownable {
    using JsonWriter for JsonWriter.Json;

    event TokenBought(uint256 indexed tokenId, address seller, address buyer);
    event TokenPriceChanged(uint256 indexed tokenId, uint256 newPrice);
    event TokenForSaleToggled(uint256 indexed tokenId);

    error TokenDoesntExist(uint256 tokenId);
    error OnlyOwner(uint256 tokenId);
    error InvalidAddress(address addr);
    error NotForSale(uint256 tokenId);
    error CantBuyYourOwnToken(address buyer, uint256 tokenId);
    error NotEnoughFunds(uint256 tokenId);
    error AlreadyRedeemed(uint256 tokenId);
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
    }

    uint256 internal _tokenCounter;
    uint16 internal constant BASIS_POINTS = 10000;

    modifier onlyExistingTokenId(uint256 tokenId) {
        if (!_exists(tokenId)) revert TokenDoesntExist(tokenId);
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (msg.sender != ownerOf(tokenId)) revert OnlyOwner(tokenId);
        _;
    }

    mapping(uint256 => Token) public tokens;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenCounter = 0;
    }

    /// @dev Mints a new token with the given parameters.
    /// @param name Name of the NFT that you are minting
    /// @param description Description of the NFT that you are minting
    /// @param work Type of work that will be done of the NFT that you are minting
    /// @param time Units of time to be redeemed of the NFT that you are minting
    /// @param date Date of when the NFT will be redeemed of the NFT that you are minting
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
            payable(msg.sender)
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
        if (!token.forSale) revert NotForSale(tokenId);
        if (msg.value < token.price) revert NotEnoughFunds(tokenId);
        token.forSale = false;
        tokens[tokenId] = token;
        _transfer(owner, msg.sender, tokenId);
        if (owner != token.mintedBy) {
            uint256 royaltyAmount = (token.price * token.royalty) / BASIS_POINTS;
            token.mintedBy.transfer(royaltyAmount);
            owner.transfer(token.price - royaltyAmount);
        } else {
            owner.transfer(token.price);
        }
        emit TokenBought(tokenId, owner, msg.sender);
    }

    /// @dev Changes the price of the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are selling
    /// @param newPrice New price of the NFT that you are selling
    function changeTokenPrice(uint256 tokenId, uint256 newPrice)
    external
    onlyExistingTokenId(tokenId)
    onlyTokenOwner(tokenId)
    {
        Token memory token = tokens[tokenId];
        token.price = newPrice;
        tokens[tokenId] = token;
    }

    /// @dev Redeems the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are redeeming
    function redeem(uint256 tokenId)
    external
    onlyExistingTokenId(tokenId)
    onlyTokenOwner(tokenId)
    {
        Token memory token = tokens[tokenId];
        if (token.redeemed) revert AlreadyRedeemed(tokenId);
        token.redeemed = true;
        tokens[tokenId] = token;
    }

    /// @dev Toggles the for sale status of the token with the given tokenId.
    /// @param tokenId The number of rings from dendrochronological sample
    function toggleForSale(uint256 tokenId) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        Token memory token = tokens[tokenId];
        token.forSale = !token.forSale;
        tokens[tokenId] = token;
        emit TokenForSaleToggled(tokenId);
    }


    /// @dev Gets the royalty information of the token with the given tokenId.
    /// @param tokenId The id of the token that you are checking
    /// @param salePrice The price of the NFT that you are querying
    /// @return True if the interface is supported, false otherwise
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
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
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

        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(writer.value))));
    }
}
