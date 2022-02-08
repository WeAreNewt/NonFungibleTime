// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

interface ISvgGenerator {
    /// @dev Generates an SVG from the given data.
    /// @param tokenId The ID of the token for which the SVG will be generated.
    /// @param minter The minter of the token.
    /// @param category Type or category label that represents the activity for what the time was tokenized.
    /// @param name Name of the NFT.
    /// @param availabilityFrom Unix timestamp indicating start of availability. Zero if does not have lower bound.
    /// @param availabilityTo Unix timestamp indicating end of availability. Zero if does not have upper bound.
    /// @param duration The actual quantity of time you are tokenizing inside availability range. Measured in seconds.
    /// @param redeemed A boolean representing if the token was already redeemed or not.
    /// @param forSale A boolean representing if the token is for sale or not.
    /// @return A string representing the generated SVG.
    function generateSvg(
        uint256 tokenId,
        address minter,
        string calldata category,
        string calldata name,
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration,
        bool redeemed,
        bool forSale
    ) external view returns (string memory);
}
