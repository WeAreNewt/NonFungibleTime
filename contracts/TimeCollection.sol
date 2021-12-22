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
contract TimeCollection is ERC721, Ownable {
    using JsonWriter for JsonWriter.Json;

    modifier onlyExistingTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token doesn't exist");
        _;
    }

    mapping(uint256 => Token) public allTokens;

    event TokenBought(uint256 indexed tokenId, address seller, address buyer);
    event TokenPriceChanged(uint256 indexed tokenId, uint256 newPrice);
    event TokenForSaleToggled(uint256 indexed tokenId);

    error TokenDoesntExist(uint256 tokenId);
    error OnlyOwner(uint256 tokenId);
    error InvalidAddress(address addr);
    error NotForSale(uint256 tokenId);
    error CantBuyYourOwnToken(address buyer, uint256 tokenId);
    error NotEnoughFunds(uint256 tokenId);
    error NullValue();

    struct Token {
        uint256 tokenId;
        string name;
        string description;
        string work;
        string time;
        string date;
        uint256 price;
        uint256 royalty;
        uint256 numberOfTransfers;
        bool forSale;
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
        tokenCounter = 0;
    }
    /// @title mint
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
        if (name.length == 0) revert NullValue();
        if (description.length == 0) revert NullValue();
        if (work.length == 0) revert NullValue();
        if (time.length == 0) revert NullValue();
        if (date.length == 0) revert NullValue();
        _safeMint(msg.sender, tokenCounter);
        require(royalty < BASIS_POINTS, "Invalid royalty");
        _safeMint(msg.sender, _tokenCounter);
        Token memory newToken = Token(
            _tokenCounter,
            name,
            description,
            work,
            time,
            date,
            0,
            royalty,
            0,
            false
        );
        tokens[_tokenCounter] = newToken;
        _tokenCounter++;
    }

    /// @title buyToken
    /// @dev Buys the token with the given tokenId.
    /// @param tokenId The token id of the NFT that you are buying
    function buyToken(uint256 tokenId) public payable onlyExistingTokenId(tokenId) {
        require(msg.sender != address(0), "Zero address is not allowed");
        address payable owner = payable(ownerOf(tokenId));
        require(owner != msg.sender, "You can't buy your own token");
        Token memory token = tokens[tokenId];
        require(token.forSale, "Token is not for sale");
        require(msg.value >= token.price, "Ether value is not enough");
        token.previousOwner = owner;
        token.forSale = false;
        token.numberOfTransfers++;
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

    /// @title changeTokenPrice
    /// @dev Changes the price of the token with the given tokenId.
    /// @param tokenId Token id of the NFT that you are selling
    /// @param newPrice New price of the NFT that you are selling
    function changeTokenPrice(uint256 tokenId, uint256 newPrice)
    external
    onlyExistingTokenId(tokenId)
    onlyTokenOwner(tokenId)
    {
        Token memory token = allTokens[tokenId];
        token.price = newPrice;
        allTokens[tokenId] = token;
    }

    /// @title toggleForSale
    /// @dev Toggles the for sale status of the token with the given tokenId.
    /// @param tokenId The number of rings from dendrochronological sample
    function toggleForSale(uint256 tokenId) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        Token memory token = allTokens[tokenId];
        token.forSale = !token.forSale;
        tokens[tokenId] = token;
        emit TokenForSaleToggled(tokenId);
    }

    /// @title getTokenURI
    /// @dev Returns the URI of the token with the given tokenId.
    /// @param tokenId Token Id of the NFT that you are getting the URI
    /// @return encoded token data in json format
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        onlyExistingTokenId(tokenId)
        returns (address, uint256)
    {
        return (tokens[tokenId].mintedBy, (salePrice * tokens[tokenId].royalty) / BASIS_POINTS);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override onlyExistingTokenId(tokenId) returns (string memory) {
        Token memory token = tokens[tokenId];
    function formatTokenURI(string memory name, string memory description, string memory work, string memory time, string memory date) private pure returns (string memory) {
    function tokenURI(uint256 tokenId) public view override onlyExistingTokenId(tokenId) returns (string memory) {
        Token memory token = allTokens[tokenId];
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
