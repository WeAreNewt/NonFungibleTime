// SPDX-License-Identifier: Undefined
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "base64-sol/base64.sol";

contract TimeCollection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using JsonWriter for JsonWriter.Json;

    Counters.Counter private _tokenIds;

    string public collectionName;
    string public collectionNameSymbol;

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

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol)
    {
        collectionName = name;
        collectionNameSymbol = symbol;
    }

    function mint(string memory name, string memory description, string memory work, string memory time, string memory date) public {
        require(msg.sender != address(0));
        uint256 newItemId = _tokenIds.current();
        string memory tokenURI = formatTokenURI(name, description, work, time, date);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        Token memory newToken = Token(
            newItemId,
            name,
            tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            false
        );
        allTokens[newItemId] = newToken;
        _tokenIds.increment();
        emit MintedNFT(newItemId, tokenURI);
    }


    function buyToken(uint256 _tokenId) public payable {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner != address(0));
        require(tokenOwner != msg.sender);
        Token memory token = allTokens[_tokenId];
        require(msg.value >= token.price);
        require(token.forSale);
        _transfer(tokenOwner, msg.sender, _tokenId);
        address payable sendTo = token.currentOwner;
        sendTo.transfer(msg.value);
        token.previousOwner = token.currentOwner;
        token.currentOwner = payable(msg.sender);
        token.numberOfTransfers += 1;
        allTokens[_tokenId] = token;
    }

    function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender);
        Token memory token = allTokens[_tokenId];
        token.price = _newPrice;
        allTokens[_tokenId] = token;
    }

    function toggleForSale(uint256 _tokenId) public {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender);
        Token memory token = allTokens[_tokenId];
        if(token.forSale) {
            token.forSale = false;
        } else {
            token.forSale = true;
        }
        allTokens[_tokenId] = token;
    }

    function getTokenMetaData(uint _tokenId) public view returns(string memory) {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    function getTokenOwner(uint256 _tokenId) public view returns(address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
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