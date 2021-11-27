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

    event MintedNFT(uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol)
    {
    }

    function mint(string memory name, string memory description, string memory work, string memory time, string memory date) public {
        uint256 newItemId = _tokenIds.current();
        string memory tokenURI = formatTokenURI(name, description, work, time, date);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        emit MintedNFT(newItemId, tokenURI);
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