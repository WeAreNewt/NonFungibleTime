// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import './interfaces/ISvgGenerator.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract SvgGenerator is ISvgGenerator {
    uint256 immutable MAX_HUE = 360;

    address public firstCirclesGenerator;
    address public thirdCircleGenerator;
    address public lastCirclesGenerator;

    constructor(
        address firstCirclesGeneratorContract,
        address thirdCircleGeneratorContract,
        address lastCirclesGeneratorContract
    ) {
        firstCirclesGenerator = firstCirclesGeneratorContract;
        thirdCircleGenerator = thirdCircleGeneratorContract;
        lastCirclesGenerator = lastCirclesGeneratorContract;
    }

    /// @inheritdoc ISvgGenerator
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
    ) external view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _getInitialPart(forSale),
                    _getMiddlePart(
                        tokenId,
                        minter,
                        category,
                        availabilityFrom,
                        availabilityTo,
                        duration
                    ),
                    _getLastPart(
                        tokenId,
                        minter,
                        category,
                        name,
                        availabilityFrom,
                        availabilityTo,
                        duration,
                        redeemed,
                        forSale
                    )
                )
            );
    }

    /// @dev Generates the first part of the SVG.
    /// @return A string representing the first part of the SVG.
    function _getInitialPart(bool rotateNewt) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 414.68 414.68"> <defs> <style> @keyframes clockwise-rotation { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes counter-clockwise-rotation { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }',
                rotateNewt
                    ? '.rotation-newt { animation: clockwise-rotation 20s linear infinite; transform-box: fill-box; transform-origin: center; } '
                    : ' '
            );
    }

    /// @dev Generates the middle part of the SVG.
    /// @return A string representing the middle part of the SVG.
    function _getMiddlePart(
        uint256 tokenId,
        address minter,
        string calldata category,
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration
    ) internal pure returns (bytes memory) {
        uint256 categoryAsInt = uint256(keccak256(bytes(category)));
        return
            abi.encodePacked(
                _rotationClass('.rotation-1', availabilityFrom + tokenId, 6, 20),
                _rotationClass('.rotation-2', uint160(minter) + tokenId, 6, 20),
                _rotationClass('.rotation-3', categoryAsInt, 6, 20),
                _rotationClass('.rotation-4', duration + tokenId, 3, 10),
                _rotationClass('.rotation-5', categoryAsInt + tokenId, 4, 10),
                _rotationClass('.rotation-6', availabilityTo + tokenId, 5, 10),
                '.cls-1, .cls-15, .cls-20, .cls-3, .cls-5, .cls-5-2 { fill: none; } .cls-17, .cls-2 { fill: hsla(',
                Strings.toString(_intToInterval(categoryAsInt, 0, MAX_HUE)),
                ', 100%, 93%, 1); } .cls-15, .cls-2, .cls-3, .cls-5, .cls-5-2 { stroke: #9a7ac6; } .cls-16, .cls-17, .cls-18, .cls-19, .cls-2, .cls-3 { stroke-miterlimit: 10; } .cls-2, .cls-3 { stroke-width: 3px; } .cls-4 { clip-path: url(#clip-path); } .cls-15, .cls-20, .cls-5, .cls-5-2 { stroke-linecap: round; stroke-linejoin: round; } .cls-5 { stroke-width: 3px; } .cls-5-2 { stroke-width: 2px; } .cls-6 { clip-path: url(#clip-path-2); } .cls-7 { clip-path: url(#clip-path-3); } .cls-8 { clip-path: url(#clip-path-4); } .cls-9 { clip-path: url(#clip-path-5); } .cls-10 { clip-path: url(#clip-path-6); } .cls-11 { clip-path: url(#clip-path-7); } .cls-12 { clip-path: url(#clip-path-8); } .cls-13 { clip-path: url(#clip-path-9); } .cls-14 { clip-path: url(#clip-path-10); } .cls-15 { stroke-width: 3px; } .cls-16, .cls-18 { fill: #9a7ac6; } .cls-16, .cls-17 { stroke: #8c6bb4; } .cls-18, .cls-19, .cls-20 { stroke: #9a7ac6; } .cls-19 { fill: #fffeff; } </style> <clipPath id="clip-path" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="387.39" y="151.38" width="18.18" height="30"/> </clipPath> <clipPath id="clip-path-2" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="255.95" y="151.38" width="18.18" height="30"/> </clipPath> <clipPath id="clip-path-3" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="385.78" y="470.94" width="18.18" height="30"/> </clipPath> <clipPath id="clip-path-4" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="254.34" y="470.94" width="18.18" height="30"/> </clipPath> <clipPath id="clip-path-5" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="153.65" y="383.1" width="30" height="18.18"/> </clipPath> <clipPath id="clip-path-6" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="153.65" y="251.66" width="30" height="18.18"/> </clipPath> <clipPath id="clip-path-7" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="472.19" y="379.79" width="30" height="18.18"/> </clipPath> <clipPath id="clip-path-8" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="472.19" y="248.35" width="30" height="18.18"/> </clipPath> <clipPath id="clip-path-9" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="391.89" y="293.49" width="34.18" height="65.04"/> </clipPath> <clipPath id="clip-path-10" transform="translate(-120.62 -118.82)"> <rect class="cls-1" x="228.75" y="293.49" width="34.18" height="65.04"/> </clipPath> </defs>'
            );
    }

    /// @dev Generates the last part of the SVG.
    /// @return A string representing the last part of the SVG.
    function _getLastPart(
        uint256 tokenId,
        address minter,
        string calldata category,
        string calldata name,
        uint256 availabilityFrom,
        uint256 availabilityTo,
        uint256 duration,
        bool redeemed,
        bool forSale
    ) internal view returns (bytes memory) {
        return
            abi.encodePacked(
                ISvgGenerator(firstCirclesGenerator).generateSvg(
                    tokenId,
                    minter,
                    category,
                    name,
                    availabilityFrom,
                    availabilityTo,
                    duration,
                    redeemed,
                    forSale
                ),
                ISvgGenerator(thirdCircleGenerator).generateSvg(
                    tokenId,
                    minter,
                    category,
                    name,
                    availabilityFrom,
                    availabilityTo,
                    duration,
                    redeemed,
                    forSale
                ),
                ISvgGenerator(lastCirclesGenerator).generateSvg(
                    tokenId,
                    minter,
                    category,
                    name,
                    availabilityFrom,
                    availabilityTo,
                    duration,
                    redeemed,
                    forSale
                )
            );
    }

    function _intToInterval(
        uint256 value,
        uint256 start,
        uint256 end
    ) internal pure returns (uint256) {
        uint256 intervalLength = end - start + 1;
        return (value % intervalLength) + start;
    }

    function _rotationClass(
        string memory className,
        uint256 value,
        uint256 slowestSpeed,
        uint256 fastestSpeed
    ) internal pure returns (bytes memory) {
        uint256 rotationSpeed = _intToInterval(value, slowestSpeed, fastestSpeed);
        return
            abi.encodePacked(
                className,
                ' { animation: ',
                value % 2 == 0 ? 'clockwise-rotation ' : 'counter-clockwise-rotation ',
                Strings.toString(rotationSpeed),
                's linear infinite; transform-box: fill-box; transform-origin: center; } '
            );
    }
}
