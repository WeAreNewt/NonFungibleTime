// SPDX-License-Identifier: Undefined
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "base64-sol/base64.sol";

contract TimeCollection is IERC2981, ERC721, Ownable {
    using JsonWriter for JsonWriter.Json;

    modifier onlyExistingTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token doesn't exist");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(msg.sender == ownerOf(tokenId), "Only token owner can do this");
        _;
    }

    event TokenBought(uint256 indexed tokenId, address seller, address buyer);
    event TokenPriceChanged(uint256 indexed tokenId, uint256 newPrice);
    event TokenForSaleToggled(uint256 indexed tokenId);

    struct Token {
        uint256 tokenId;
        string name;
        string description;
        string work;
        string time;
        string date;
        address payable mintedBy;
        address payable previousOwner;
        uint256 price;
        uint256 royalty;
        uint256 numberOfTransfers;
        bool forSale;
    }

    uint256 internal _tokenCounter;
    uint16 internal constant BASIS_POINTS = 10000;

    string public COLLECTION_NAME;
    string public COLLECTION_SYMBOL;

    mapping(uint256 => Token) public tokens;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        COLLECTION_NAME = name;
        COLLECTION_SYMBOL = symbol;
        _tokenCounter = 0;
    }

    function mint(
        string memory name,
        string memory description,
        string memory work,
        string memory time,
        string memory date,
        uint256 royalty
    ) external {
        require(royalty < BASIS_POINTS, "Invalid royalty");
        _safeMint(msg.sender, _tokenCounter);
        Token memory newToken = Token(
            _tokenCounter,
            name,
            description,
            work,
            time,
            date,
            payable(msg.sender),
            payable(address(0)),
            0,
            royalty,
            0,
            false
        );
        tokens[_tokenCounter] = newToken;
        _tokenCounter++;
    }

    function buyToken(uint256 tokenId) external payable onlyExistingTokenId(tokenId) {
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

    function changeTokenPrice(uint256 tokenId, uint256 newPrice)
        external
        onlyExistingTokenId(tokenId)
        onlyTokenOwner(tokenId)
    {
        tokens[tokenId].price = newPrice;
        emit TokenPriceChanged(tokenId, newPrice);
    }

    function toggleForSale(uint256 tokenId) external onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) {
        Token memory token = tokens[tokenId];
        token.forSale = !token.forSale;
        tokens[tokenId] = token;
        emit TokenForSaleToggled(tokenId);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        onlyExistingTokenId(tokenId)
        returns (address, uint256)
    {
        return (tokens[tokenId].mintedBy, (salePrice * tokens[tokenId].royalty) / BASIS_POINTS);
    }

    function tokenURI(uint256 tokenId) public view override onlyExistingTokenId(tokenId) returns (string memory) {
        Token memory token = tokens[tokenId];
        JsonWriter.Json memory writer;

        writer = writer.writeStartObject();

        writer = writer.writeStringProperty("name", token.name);
        writer = writer.writeStringProperty("description", token.description);

        writer = writer.writeStartArray("attributes");

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "type");
        writer = writer.writeStringProperty("value", token.work);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Number of Hours");
        writer = writer.writeStringProperty("value", token.time);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Date");
        writer = writer.writeStringProperty("value", token.date);
        writer = writer.writeEndObject();

        writer = writer.writeEndArray();

        writer = writer.writeEndObject();

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(writer.value))));
    }
}
