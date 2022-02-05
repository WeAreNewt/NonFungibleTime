// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

interface ISvgGenerator {
    /// @dev Generates an SVG from the given data.
    /// @param tokenId TODO
    /// @param minter TODO
    /// @param category Type or category label that represents the activity for what the time was tokenized.
    /// @param name TODO
    /// @param availabilityFrom TODO
    /// @param availabilityTo TODO
    /// @param duration TODO
    /// @param redeemed A boolean representing if the token is already redeemed or not.
    /// @param forSale TODO
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
