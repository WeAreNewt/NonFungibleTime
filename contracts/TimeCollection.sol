// SPDX-License-Identifier: Undefined
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SvgHelper.sol";

contract TimeCollection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event MintedNFT(uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol)
    {
    }

    function mint(string memory svg, string memory name, string memory description) public {
        uint256 newItemId = _tokenIds.current();
        string memory imageURI = SvgHelper.svgToImageURI(svg);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, formatTokenURI(imageURI, name, description));
        _tokenIds.increment();
        emit MintedNFT(newItemId, imageURI);
    }

    function formatTokenURI(string memory imageURI, string memory name, string memory description) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name": "', name,
                            '", "description": "', description,
                            '", "attributes":"",',
                            '"image":"',imageURI,'"}'
                        )
                    )
                )
            )
        );
    }
}