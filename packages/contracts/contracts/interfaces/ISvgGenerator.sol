// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

interface ISvgGenerator {
    /// @dev Generates an SVG from the given data.
    /// @param redeemed A boolean representing if the token is already redeemed or not.
    /// @param category Type or category label that represents the activity for what the time was tokenized.
    /// @return A string representing the generated SVG.
    function generateSvg(bool redeemed, string calldata category)
        external
        view
        returns (string memory);
}
