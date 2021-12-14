// SPDX-License-Identifier: Undefined
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "base64-sol/base64.sol";

contract TimeCollection is ERC721URIStorage, Ownable {
    using JsonWriter for JsonWriter.Json;

    uint256 private tokenCounter;

    string public COLLECTION_NAME;
    string public COLLECTION_SYMBOL;

    mapping(uint256 => Token) public allTokens;

    event MintedNFT(uint256 indexed tokenId, string tokenURI);

    struct Token {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        uint256 numberOfTransfers;
        bool forSale;
    }

    modifier onlyExistingTokenId(uint256 tokenId) {
        require(
            _exists(tokenId),
            "Token doesn't exist");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(
            msg.sender == ownerOf(tokenId),
            "Only token owner can do this");
        _;
    }

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol)
    {
        COLLECTION_NAME = name;
        COLLECTION_SYMBOL = symbol;
        tokenCounter = 0;
    }

    function mint(string memory name, string memory description, string memory work, string memory time, string memory date) public {
        string memory tokenURI = formatTokenURI(name, description, work, time, date);
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        Token memory newToken = Token(
            tokenCounter,
            name,
            tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            false
        );
        allTokens[tokenCounter] = newToken;
        tokenCounter++;
        emit MintedNFT(tokenCounter, tokenURI);
    }


    function buyToken(uint256 tokenId) onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId)  public payable {
        require(msg.sender != address(0), "Zero address is not allowed");
        require(ownerOf(tokenId) != address(0), "Token is not for sale");
        require(ownerOf(tokenId) != msg.sender, "You can't buy your own token");
        Token memory token = allTokens[tokenId];
        require(token.forSale, "Token is not for sale");
        require(msg.value >= token.price, "Ethereum value is not enough");
        _transfer(ownerOf(tokenId), msg.sender, tokenId);
        address payable sendTo = token.currentOwner;
        sendTo.transfer(msg.value);
        token.previousOwner = token.currentOwner;
        token.currentOwner = payable(msg.sender);
        token.numberOfTransfers += 1;
        allTokens[tokenId] = token;
    }

    function changeTokenPrice(uint256 tokenId, uint256 newPrice) onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) public {
        require(msg.sender != address(0), "Zero address is not allowed");
        Token memory token = allTokens[tokenId];
        token.price = newPrice;
        allTokens[tokenId] = token;
    }

    function toggleForSale(uint256 tokenId) onlyExistingTokenId(tokenId) onlyTokenOwner(tokenId) public {
        require(msg.sender != address(0), "Zero address is not allowed");
        Token memory token = allTokens[tokenId];
        token.forSale = !token.forSale;
        allTokens[tokenId] = token;
    }

    function formatTokenURI(string memory name, string memory description, string memory work, string memory time, string memory date) private pure returns (string memory) {
        JsonWriter.Json memory writer;

        writer = writer.writeStartObject();

        writer = writer.writeStringProperty("name", name);
        writer = writer.writeStringProperty("description", description);

        writer = writer.writeStartArray("attributes");

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "type");
        writer = writer.writeStringProperty("value", work);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Number of Hours");
        writer = writer.writeStringProperty("value", time);
        writer = writer.writeEndObject();

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("trait_type", "Date");
        writer = writer.writeStringProperty("value", date);
        writer = writer.writeEndObject();

        writer = writer.writeEndArray();

        writer = writer.writeEndObject();

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(writer.value))
            )
        );
    }
}