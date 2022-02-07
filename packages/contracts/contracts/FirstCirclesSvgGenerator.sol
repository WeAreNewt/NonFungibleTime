// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import './interfaces/ISvgGenerator.sol';

contract FirstCirclesSvgGenerator is ISvgGenerator {
    /// @inheritdoc ISvgGenerator
    function generateSvg(
        uint256 tokenId,
        address,
        string calldata,
        string calldata name,
        uint256 availabilityFrom,
        uint256,
        uint256,
        bool,
        bool
    ) external pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<g id="Base"><circle class="cls-2" cx="207.34" cy="207.34" r="205.34"/></g> ',
                    _getCircle1(_isPair(uint256(keccak256(bytes(name))))),
                    _getCircle2(_isPair(availabilityFrom + tokenId))
                )
            );
    }

    function _getCircle1(bool useFirstVariation) internal pure returns (string memory) {
        return
            useFirstVariation
                ? '<g id="Circle1" class="rotation-1"><circle class="cls-3" cx="207.34" cy="207.34" r="192.47"/></g>'
                : '<g id="Circle1" class="rotation-1"><circle class="cls-3" cx="207.34" cy="207.34" r="192.47"/><path class="cls-5-2" d="M332.57 524.35c0 2.52-3.82 6.07-3.82 6.07s-3.57-3.8-3.57-6.32a3.55 3.55 0 0 1 3.44-3.58c1.38.02 3.95 1.3 3.95 3.83Zm-22.16-.79c-.28 2.51-4.48 5.61-4.48 5.61s-3.12-4.18-2.84-6.69a3.54 3.54 0 0 1 3.82-3.16c1.36.17 3.78 1.73 3.5 4.24Zm-21.94-3.26c-.56 2.46-5.07 5.07-5.07 5.07s-2.64-4.5-2.08-7a3.53 3.53 0 0 1 4.15-2.72c1.33.35 3.53 2.18 3 4.65ZM267 514.6c-.83 2.38-5.61 4.47-5.61 4.47s-2.12-4.77-1.29-7.15a3.55 3.55 0 0 1 4.43-2.24c1.33.47 3.34 2.53 2.47 4.92Zm-20.62-8.06c-1.1 2.27-6.08 3.81-6.08 3.81s-1.57-5-.47-7.25a3.53 3.53 0 0 1 4.64-1.73c1.24.63 3.01 2.89 1.91 5.17Zm-19.63-10.33c-1.34 2.14-6.46 3.11-6.46 3.11s-1-5.12.33-7.26a3.54 3.54 0 0 1 4.82-1.19c1.15.74 2.66 3.2 1.31 5.34Zm-18.35-12.46c-1.57 2-6.77 2.36-6.77 2.36s-.43-5.19 1.15-7.17a3.54 3.54 0 0 1 4.91-.65c1.07.87 2.31 3.49.71 5.46Zm-16.83-14.43c-1.79 1.78-7 1.59-7 1.59s.16-5.22 1.94-7a3.54 3.54 0 0 1 5-.1c.92.99 1.84 3.72.06 5.51Zm-15.12-16.23c-2 1.57-7.13.79-7.13.79s.74-5.16 2.72-6.73a3.52 3.52 0 0 1 4.93.46c.85 1.08 1.46 3.9-.52 5.48Zm-13.2-17.82c-2.14 1.34-7.18 0-7.18 0s1.32-5 3.46-6.39a3.55 3.55 0 0 1 4.85 1c.72 1.18 1.01 4.04-1.13 5.39Zm-11.13-19.19c-2.27 1.1-7.13-.81-7.13-.81s1.87-4.86 4.15-6a3.54 3.54 0 0 1 4.71 1.55c.58 1.28.55 4.18-1.73 5.26Zm-8.9-20.31c-2.39.84-7-1.6-7-1.6s2.4-4.63 4.79-5.46a3.54 3.54 0 0 1 4.51 2.06c.48 1.31.08 4.17-2.3 5Zm-6.58-21.18c-2.46.56-6.77-2.37-6.77-2.37s2.9-4.33 5.37-4.89a3.52 3.52 0 0 1 4.24 2.55c.3 1.35-.38 4.12-2.84 4.71Zm-4.17-21.78c-2.51.28-6.46-3.12-6.46-3.12s3.37-4 5.88-4.26a3.55 3.55 0 0 1 3.94 3c.17 1.39-.83 4.1-3.36 4.38Zm-1.7-22.11c-2.52 0-6.07-3.83-6.07-3.83s3.8-3.57 6.32-3.57a3.55 3.55 0 0 1 3.58 3.44c-.02 1.37-1.3 3.96-3.83 3.96Zm.79-22.17c-2.51-.28-5.61-4.48-5.61-4.48s4.18-3.12 6.69-2.84a3.54 3.54 0 0 1 3.16 3.79c-.17 1.39-1.73 3.81-4.24 3.53Zm3.26-21.93c-2.46-.57-5.07-5.08-5.07-5.08s4.5-2.64 7-2.08a3.53 3.53 0 0 1 2.72 4.15c-.36 1.34-2.18 3.57-4.65 3.01Zm5.7-21.44c-2.38-.83-4.47-5.61-4.47-5.61s4.77-2.12 7.15-1.29a3.54 3.54 0 0 1 2.24 4.43c-.44 1.31-2.53 3.31-4.92 2.47Zm8.07-20.66c-2.28-1.09-3.82-6.08-3.82-6.08s5-1.57 7.25-.47a3.53 3.53 0 0 1 1.73 4.65c-.61 1.23-2.89 3-5.16 1.9Zm10.32-19.63c-2.14-1.34-3.11-6.46-3.11-6.46s5.12-1 7.26.33a3.55 3.55 0 0 1 1.2 4.82c-.75 1.15-3.21 2.66-5.35 1.31Zm12.46-18.34c-2-1.58-2.36-6.78-2.36-6.78s5.19-.42 7.17 1.15a3.55 3.55 0 0 1 .65 4.92c-.83 1.06-3.48 2.28-5.46.71Zm14.44-16.84c-1.79-1.79-1.6-7-1.6-7s5.22.16 7 1.95a3.53 3.53 0 0 1 .1 5c-.99.92-3.72 1.83-5.5.05ZM202 174.57c-1.57-2-.79-7.13-.79-7.13s5.16.74 6.73 2.72a3.52 3.52 0 0 1-.46 4.93c-1.05.85-3.87 1.46-5.48-.52Zm17.85-13.2c-1.34-2.14 0-7.18 0-7.18s5 1.32 6.39 3.46a3.55 3.55 0 0 1-1 4.85c-1.17.72-4.04 1.01-5.39-1.13ZM239 150.24c-1.1-2.27.81-7.13.81-7.13s4.86 1.87 6 4.15a3.53 3.53 0 0 1-1.55 4.71c-1.26.58-4.13.55-5.26-1.73Zm20.35-8.9c-.83-2.39 1.6-7 1.6-7s4.63 2.41 5.46 4.79a3.54 3.54 0 0 1-2.06 4.51c-1.35.44-4.17.08-5-2.3Zm21.18-6.58c-.56-2.46 2.38-6.77 2.38-6.77s4.32 2.9 4.89 5.37a3.55 3.55 0 0 1-2.56 4.25c-1.35.29-4.15-.39-4.71-2.85Zm21.78-4.17c-.28-2.51 3.12-6.46 3.12-6.46s4 3.37 4.26 5.88a3.55 3.55 0 0 1-3 3.94c-1.38.14-4.09-.85-4.38-3.36Zm22.12-1.7c0-2.52 3.82-6.07 3.82-6.07s3.57 3.8 3.57 6.32a3.55 3.55 0 0 1-3.44 3.58c-1.38-.02-3.95-1.3-3.95-3.83Zm22.16.79c.28-2.51 4.48-5.6 4.48-5.6s3.12 4.17 2.84 6.68a3.53 3.53 0 0 1-3.82 3.16c-1.36-.16-3.78-1.73-3.5-4.24Zm21.94 3.32c.56-2.47 5.07-5.07 5.07-5.07s2.64 4.49 2.08 7a3.53 3.53 0 0 1-4.15 2.71c-1.33-.41-3.53-2.23-3-4.64Zm21.47 5.65c.83-2.39 5.61-4.47 5.61-4.47s2.12 4.76 1.29 7.14a3.54 3.54 0 0 1-4.43 2.24c-1.33-.47-3.34-2.56-2.47-4.91Zm20.62 8.06c1.1-2.28 6.08-3.81 6.08-3.81s1.57 5 .47 7.24a3.53 3.53 0 0 1-4.64 1.73c-1.24-.61-3.01-2.87-1.91-5.16ZM430.25 157c1.34-2.13 6.47-3.1 6.47-3.1s1 5.11-.34 7.25a3.55 3.55 0 0 1-4.82 1.2c-1.15-.72-2.66-3.18-1.31-5.35Zm18.35 12.49c1.57-2 6.77-2.36 6.77-2.36s.43 5.19-1.15 7.17a3.54 3.54 0 0 1-4.91.65c-1.07-.87-2.31-3.48-.71-5.46Zm16.83 14.44c1.79-1.79 7-1.59 7-1.59s-.16 5.21-1.94 7a3.54 3.54 0 0 1-5 .1c-.92-1-1.84-3.73-.06-5.51Zm15.12 16.23c2-1.58 7.13-.8 7.13-.8s-.74 5.16-2.72 6.73a3.52 3.52 0 0 1-4.93-.46c-.85-1.08-1.46-3.9.52-5.47Zm13.2 17.84c2.14-1.35 7.18 0 7.18 0s-1.32 5.05-3.45 6.39a3.55 3.55 0 0 1-4.86-1c-.72-1.2-1.01-4.07 1.13-5.39Zm11.13 19.16c2.27-1.1 7.13.81 7.13.81s-1.87 4.87-4.15 6a3.53 3.53 0 0 1-4.71-1.55c-.58-1.28-.55-4.16 1.73-5.26Zm8.9 20.31c2.39-.83 7 1.6 7 1.6s-2.4 4.63-4.79 5.46a3.54 3.54 0 0 1-4.51-2.06c-.48-1.3-.08-4.16 2.3-5Zm6.58 21.18c2.47-.56 6.77 2.38 6.77 2.38s-2.9 4.32-5.37 4.89a3.53 3.53 0 0 1-4.24-2.56c-.3-1.36.38-4.15 2.84-4.71Zm4.17 21.78c2.51-.28 6.46 3.12 6.46 3.12s-3.37 4-5.88 4.26a3.55 3.55 0 0 1-3.94-3c-.17-1.38.83-4.09 3.36-4.38Zm1.7 22.12c2.52 0 6.07 3.82 6.07 3.82s-3.8 3.57-6.32 3.57a3.55 3.55 0 0 1-3.58-3.44c.02-1.37 1.3-3.95 3.83-3.95Zm-.79 22.16c2.51.28 5.61 4.48 5.61 4.48s-4.18 3.12-6.69 2.84a3.53 3.53 0 0 1-3.16-3.81c.17-1.37 1.73-3.79 4.24-3.51Zm-3.26 21.94c2.46.56 5.07 5.08 5.07 5.08s-4.5 2.63-7 2.07a3.53 3.53 0 0 1-2.72-4.15c.36-1.33 2.18-3.56 4.65-3Zm-5.7 21.43c2.38.84 4.47 5.62 4.47 5.62s-4.77 2.11-7.15 1.28a3.54 3.54 0 0 1-2.24-4.43c.44-1.29 2.53-3.3 4.92-2.47Zm-8.07 20.66c2.28 1.1 3.82 6.08 3.82 6.08s-5 1.57-7.25.48a3.54 3.54 0 0 1-1.73-4.65c.61-1.24 2.89-3 5.16-1.91Zm-10.32 19.63c2.14 1.34 3.11 6.47 3.11 6.47s-5.12 1-7.26-.34a3.53 3.53 0 0 1-1.19-4.81c.74-1.16 3.25-2.69 5.34-1.32Zm-12.46 18.35c2 1.57 2.36 6.77 2.36 6.77s-5.19.43-7.17-1.15a3.54 3.54 0 0 1-.65-4.91c.83-1.07 3.48-2.29 5.46-.71Zm-14.43 16.83c1.78 1.79 1.59 7 1.59 7s-5.22-.16-7-1.94a3.54 3.54 0 0 1-.1-5c.99-.92 3.72-1.84 5.51-.06ZM455 478.67c1.57 2 .79 7.13.79 7.13s-5.16-.74-6.73-2.71a3.53 3.53 0 0 1 .46-4.94c1.05-.85 3.87-1.45 5.48.52Zm-17.85 13.2c1.34 2.14 0 7.18 0 7.18s-5.05-1.32-6.39-3.45a3.55 3.55 0 0 1 1-4.86c1.17-.74 4.04-1 5.39 1.13ZM418 503c1.1 2.27-.81 7.13-.81 7.13s-4.86-1.87-6-4.15a3.54 3.54 0 0 1 1.55-4.71c1.26-.58 4.13-.55 5.26 1.73Zm-20.35 8.91c.83 2.38-1.6 7-1.6 7s-4.63-2.4-5.46-4.79a3.54 3.54 0 0 1 2.06-4.51c1.35-.45 4.17-.09 5 2.3Zm-21.18 6.57c.56 2.47-2.38 6.77-2.38 6.77s-4.32-2.9-4.89-5.36a3.54 3.54 0 0 1 2.56-4.25c1.35-.29 4.15.36 4.71 2.84Zm-21.78 4.17c.28 2.51-3.12 6.46-3.12 6.46s-4-3.37-4.26-5.88a3.55 3.55 0 0 1 3-3.94c1.39-.14 4.09.85 4.38 3.36Z" transform="translate(-121.62 -119.82)"/></g>';
    }

    function _getCircle2(bool useFirstVariation) internal pure returns (string memory) {
        return
            useFirstVariation
                ? '<g id="Circle2" class="rotation-2"><g><g class="cls-4"><polygon class="cls-5" points="272.77 55.6 271.1 45.49 283.46 34.06 282.5 50.17 272.77 55.6"/><polyline class="cls-5" points="268.27 51.18 270.35 61.06 279.61 56.37"/></g><g class="cls-6"><polygon class="cls-5" points="147.52 55.6 149.19 45.49 136.83 34.06 137.79 50.17 147.52 55.6"/><polyline class="cls-5" points="152.02 51.18 149.94 61.06 140.68 56.37"/></g></g><g><g class="cls-7"><polygon class="cls-5" points="271.16 359.08 269.48 369.2 281.84 380.62 280.88 364.51 271.16 359.08"/><polyline class="cls-5" points="266.66 363.5 268.73 353.62 278 358.31"/></g><g class="cls-8"><polygon class="cls-5" points="145.91 359.08 147.58 369.2 135.22 380.62 136.18 364.51 145.91 359.08"/><polyline class="cls-5" points="150.41 363.5 148.33 353.62 139.06 358.31"/></g></g><g><g class="cls-9"><polygon class="cls-5" points="56.06 270.28 45.95 268.6 34.53 280.96 50.64 280 56.06 270.28"/><polyline class="cls-5" points="51.65 265.78 61.52 267.85 56.84 277.12"/></g><g class="cls-10"><polygon class="cls-5" points="56.06 145.03 45.95 146.7 34.53 134.34 50.64 135.3 56.06 145.03"/><polyline class="cls-5" points="51.65 149.53 61.52 147.45 56.84 138.18"/></g></g><g><g class="cls-11"><polygon class="cls-5" points="358.54 266.97 368.65 265.3 380.07 277.66 363.96 276.7 358.54 266.97"/><polyline class="cls-5" points="362.95 262.47 353.07 264.55 357.76 273.81"/></g><g class="cls-12"><polygon class="cls-5" points="358.54 141.72 368.65 143.4 380.07 131.03 363.96 131.99 358.54 141.72"/><polyline class="cls-5" points="362.95 146.22 353.07 144.15 357.76 134.88"/></g></g><path class="cls-5" d="M328.91,169.53s51.13-31.73,78.54-18.7c27.65,13.13,30.74,64.79,30.74,64.79S496,231,503.66,247.48c8.57,18.36-19.64,78.65-19.64,78.65s30,51.91,23.66,69C500.94,413.49,440.47,435,440.47,435s-15.3,58.36-31.9,66.29c-18.63,8.9-80.43-18.89-80.43-18.89s-54.87,25.92-72.4,19c-18.65-7.32-38.63-65.86-38.63-65.86s-58.1-16.47-65.7-33.23c-8-17.67,19.25-75.15,19.25-75.15s-26.55-59-19.82-76.48c6.93-17.94,64.39-35.3,64.39-35.3s26.7-60.9,45.24-67.69C281.18,140.15,328.91,169.53,328.91,169.53Z" transform="translate(-120.62 -118.82)"/><circle class="cls-3" cx="207.34" cy="207.34" r="155.53"/></g>'
                : '<g id="Circle2" class="rotation-2"><circle class="cls-2" cx="206.34" cy="206.34" r="192.47"/><path class="cls-2" d="M333.61 512.51c-1.41.5-5.41.41-5.41.41a27.84 27.84 0 0 1-5.34-.37c-4.08-1.22.29-11.82-2.77-13.26-8.86-4.16 8.24-13.37 8.24-13.37s17.29 7.95 8.1 13.37c-2.91 1.71 1.31 11.71-2.82 13.22Zm-28.51-1.31c-1.47.28-5.42-.42-5.42-.42a27.62 27.62 0 0 1-5.21-1.19c-3.84-1.82 2.09-11.63-.72-13.52-8.11-5.46 10.19-11.95 10.19-11.95s15.87 10.49 6 14.45c-3.18 1.25-.54 11.8-4.84 12.63Zm-27.98-5.65a24.39 24.39 0 0 1-5.29-1.24 27.74 27.74 0 0 1-5-2c-3.52-2.39 3.84-11.17 1.36-13.47-7.19-6.64 11.89-10.26 11.89-10.26s14.08 12.79 3.68 15.19c-3.26.79-2.26 11.62-6.64 11.78Zm-26.79-9.86c-1.48-.17-5-2-5-2a27.41 27.41 0 0 1-4.62-2.7c-3.11-2.9 5.51-10.46 3.4-13.11-6.09-7.66 13.32-8.32 13.32-8.32s12 14.79 1.32 15.57c-3.4.22-4.07 11.08-8.42 10.56Zm-24.97-13.82c-1.44-.4-4.67-2.78-4.67-2.78a27.8 27.8 0 0 1-4.14-3.37c-2.64-3.35 7-9.5 5.35-12.44-4.85-8.5 14.44-6.19 14.44-6.19s9.56 16.44-1.07 15.59c-3.37-.27-5.69 10.32-9.91 9.19Zm-22.57-17.48c-1.36-.61-4.18-3.46-4.18-3.46a27.24 27.24 0 0 1-3.59-4c-2.09-3.7 8.41-8.31 7.2-11.47-3.5-9.13 15.2-3.91 15.2-3.91s7 17.71-3.43 15.24c-3.29-.74-7.2 9.4-11.2 7.6Zm-19.63-20.72c-1.25-.81-3.61-4.05-3.61-4.05a27.59 27.59 0 0 1-2.94-4.47c-1.5-4 9.58-6.93 8.86-10.24-2.06-9.56 15.63-1.55 15.63-1.55s4.16 18.56-5.72 14.55c-3.13-1.28-8.55 8.15-12.22 5.76Zm-16.24-23.47c-1.12-1-2.95-4.56-2.95-4.56a27.78 27.78 0 0 1-2.22-4.86c-.88-4.17 10.52-5.39 10.32-8.77-.58-9.77 15.68.86 15.68.86s1.28 19-7.88 13.5c-2.87-1.74-9.69 6.75-12.95 3.83Zm-12.47-25.67c-.95-1.16-2.22-5-2.22-5a27.56 27.56 0 0 1-1.45-5.15c-.23-4.25 11.22-3.72 11.54-7.09.92-9.73 15.36 3.24 15.36 3.24s-1.63 19-9.84 12.14c-2.6-2.11-10.61 5.24-13.39 1.86ZM146 367.25c-.76-1.29-1.43-5.24-1.43-5.24a27.65 27.65 0 0 1-.65-5.31c.42-4.23 11.66-2 12.49-5.24 2.39-9.49 14.69 5.55 14.69 5.55s-4.51 18.48-11.59 10.49c-2.2-2.5-11.24 3.5-13.51-.25ZM141.9 339a24.46 24.46 0 0 1-.62-5.4 28.24 28.24 0 0 1 .17-5.34c1.07-4.12 11.82-.16 13.14-3.28 3.82-9 13.68 7.73 13.68 7.73s-7.28 17.57-13.05 8.6c-1.83-2.83-11.69 1.76-13.32-2.31Zm.22-28.54c-.34-1.45.21-5.42.21-5.42a27.55 27.55 0 0 1 1-5.26c1.68-3.91 11.7 1.65 13.48-1.23 5.15-8.32 12.34 9.72 12.34 9.72s-9.88 16.26-14.21 6.51c-1.39-3.09-11.83-.05-12.82-4.32Zm4.57-28.17c-.11-1.49 1-5.33 1-5.33a27.59 27.59 0 0 1 1.78-5c2.25-3.61 11.31 3.41 13.51.84 6.36-7.44 10.71 11.49 10.71 11.49s-12.24 14.56-15 4.26c-.89-3.3-11.69-1.89-12-6.26Zm8.82-27.15c.12-1.48 1.84-5.1 1.84-5.1a27.47 27.47 0 0 1 2.53-4.72c2.78-3.22 10.66 5.1 13.23 2.89 7.41-6.38 8.82 13 8.82 13s-14.32 12.53-15.51 1.92c-.42-3.36-11.25-3.62-10.91-7.99Zm12.87-25.48c.34-1.45 2.59-4.77 2.59-4.77a27.88 27.88 0 0 1 3.22-4.27c3.24-2.76 9.76 6.67 12.63 4.88 8.3-5.17 6.74 14.18 6.74 14.18s-16.06 10.19-15.62-.47c.13-3.37-10.57-5.29-9.56-9.55ZM185 206.44c.56-1.38 3.29-4.31 3.29-4.31a27.87 27.87 0 0 1 3.83-3.74c3.62-2.23 8.63 8.08 11.74 6.75 9-3.84 4.49 15.05 4.49 15.05s-17.43 7.62-15.37-2.85c.64-3.34-9.65-6.84-7.98-10.9ZM204.93 186c.76-1.28 3.91-3.76 3.91-3.76a28.36 28.36 0 0 1 4.35-3.11c3.92-1.65 7.3 9.3 10.58 8.46 9.47-2.42 2.14 15.56 2.14 15.56s-18.39 4.87-14.75-5.16c1.15-3.15-8.48-8.2-6.23-11.99Zm22.83-17.1c1-1.15 4.44-3.12 4.44-3.12a28 28 0 0 1 4.78-2.41c4.12-1 5.78 10.31 9.15 10 9.74-.95-.25 15.7-.25 15.7s-18.92 2-13.79-7.35c1.62-2.98-7.09-9.45-4.33-12.82Zm25.18-13.44c1.11-1 4.86-2.41 4.86-2.41a27.81 27.81 0 0 1 5.09-1.65c4.24-.39 4.15 11.07 7.53 11.26 9.77.55-2.65 15.48-2.65 15.48s-19-.91-12.51-9.37c2.06-2.68-5.6-10.41-2.32-13.31Zm26.93-9.46a24.6 24.6 0 0 1 5.18-1.63 28 28 0 0 1 5.28-.85c4.25.26 2.41 11.57 5.72 12.27 9.57 2-5 14.9-5 14.9s-18.64-3.8-10.93-11.18c2.46-2.32-3.93-11.12-.25-13.51Zm28.07-5.21a24.38 24.38 0 0 1 5.36-.82 27.67 27.67 0 0 1 5.35 0c4.16.91.61 11.81 3.78 13 9.14 3.47-7.2 14-7.2 14s-17.84-6.6-9.1-12.71c2.77-2.01-2.2-11.68 1.81-13.47Zm28.53-.87a24.19 24.19 0 0 1 5.42 0 27.73 27.73 0 0 1 5.29.78c4 1.53-1.19 11.76 1.75 13.43 8.51 4.83-9.24 12.7-9.24 12.7s-16.62-9.24-7.05-14c3.03-1.44-.4-11.76 3.83-12.91Zm28.32 3.49c1.49-.17 5.37.83 5.37.83a27.77 27.77 0 0 1 5.11 1.58c3.69 2.12-3 11.44-.32 13.54 7.67 6.07-11.08 11.14-11.08 11.14s-15-11.68-4.83-14.87c3.22-1.01 1.4-11.73 5.75-12.22Zm27.47 7.77c1.49.06 5.17 1.64 5.17 1.64a28.07 28.07 0 0 1 4.81 2.35c3.33 2.65-4.69 10.85-2.38 13.33 6.66 7.16-12.65 9.31-12.65 9.31s-13.06-13.81-2.51-15.42c3.3-.51 3.18-11.39 7.56-11.21Zm25.95 11.88c1.47.29 4.87 2.41 4.87 2.41a27.73 27.73 0 0 1 4.39 3.05c2.88 3.13-6.29 10-4.39 12.81 5.49 8.1-13.92 7.28-13.92 7.28S398.37 173 409 173c3.41 0 4.91-10.78 9.21-9.94Zm23.84 15.7c1.41.51 4.44 3.12 4.44 3.12a28.06 28.06 0 0 1 3.88 3.69c2.37 3.53-7.74 8.93-6.3 12 4.19 8.84-14.86 5.06-14.86 5.06s-8.28-17.12 2.26-15.46c3.34.51 6.46-9.9 10.58-8.41Zm21.17 19.15a24.5 24.5 0 0 1 3.9 3.77 27.45 27.45 0 0 1 3.27 4.23c1.81 3.86-9 7.64-8.05 10.89 2.79 9.38-15.46 2.74-15.46 2.74s-5.57-18.19 4.59-14.94c3.22 1.03 7.9-8.79 11.75-6.69Zm17.99 22.16a24.45 24.45 0 0 1 3.29 4.32 27.92 27.92 0 0 1 2.58 4.68c1.19 4.09-10.08 6.18-9.62 9.53 1.32 9.7-15.7.35-15.7.35s-2.73-18.82 6.82-14.06c3.02 1.5 9.15-7.48 12.63-4.82Zm14.39 24.65c1 1.07 2.6 4.77 2.6 4.77a27.54 27.54 0 0 1 1.83 5c.56 4.22-10.9 4.57-11 7.95-.17 9.78-15.57-2-15.57-2s.18-19 8.89-12.86c2.8 1.92 10.22-6.03 13.25-2.86Zm10.47 26.55c.86 1.22 1.83 5.11 1.83 5.11a27.38 27.38 0 0 1 1.05 5.24c-.09 4.26-11.47 2.86-12 6.19-1.67 9.64-15.08-4.41-15.08-4.41s3.09-18.77 10.75-11.35c2.38 2.35 10.94-4.37 13.45-.78Zm6.29 27.84c.66 1.34 1 5.33 1 5.33a28.09 28.09 0 0 1 .24 5.35c-.74 4.19-11.77 1.06-12.85 4.27-3.11 9.27-14.22-6.66-14.22-6.66s5.91-18.08 12.35-9.57c2.12 2.69 11.55-2.65 13.48 1.28Zm1.97 28.48a24.4 24.4 0 0 1 .2 5.42 27.58 27.58 0 0 1-.58 5.32c-1.37 4-11.79-.74-13.35 2.26-4.49 8.69-13-8.75-13-8.75s8.6-17 13.67-7.58c1.57 2.98 11.73-.85 13.06 3.33Zm-2.4 28.41a24.23 24.23 0 0 1-.63 5.39 28.53 28.53 0 0 1-1.38 5.17c-2 3.77-11.55-2.54-13.55.2-5.76 7.9-11.55-10.64-11.55-10.64s11.09-15.46 14.67-5.4c1.13 3.21 11.78.98 12.44 5.28Zm-6.72 27.77c0 1.5-1.44 5.24-1.44 5.24a28.12 28.12 0 0 1-2.16 4.89c-2.52 3.43-11-4.27-13.41-1.87-6.91 6.93-9.79-12.28-9.79-12.28s13.31-13.58 15.31-3.1c.64 3.35 11.5 2.74 11.49 7.12Zm-10.87 26.39c-.23 1.48-2.23 5-2.23 5a27.69 27.69 0 0 1-2.88 4.5c-3 3-10.24-5.9-13-3.89-7.89 5.79-7.81-13.63-7.81-13.63s15.24-11.39 15.61-.73c.16 3.34 10.97 4.43 10.31 8.75Zm-14.78 24.43c-.45 1.42-2.95 4.55-2.95 4.55a28.44 28.44 0 0 1-3.53 4c-3.45 2.5-9.22-7.4-12.23-5.83-8.67 4.52-5.63-14.66-5.63-14.66s16.8-8.93 15.54 1.66c-.4 3.38 10.13 6.1 8.8 10.28Zm-18.33 21.88c-.66 1.33-3.61 4-3.61 4a28.21 28.21 0 0 1-4.1 3.43c-3.79 1.95-8-8.72-11.19-7.63C433.06 459.46 439 441 439 441s18-6.26 15.1 4c-.9 3.24 9.09 7.55 7.13 11.47Zm-21.45 18.82c-.86 1.22-4.19 3.46-4.19 3.46a28 28 0 0 1-4.58 2.76c-4 1.35-6.56-9.83-9.89-9.25-9.64 1.69-.95-15.67-.95-15.67s18.71-3.45 14.31 6.27c-1.39 3.08 7.83 8.86 5.3 12.43Zm-24.08 15.34c-1 1.07-4.66 2.77-4.66 2.77a28.53 28.53 0 0 1-5 2c-4.2.71-5-10.72-8.37-10.65-9.78.2 1.46-15.64 1.46-15.64s19-.55 13.19 8.39c-1.8 2.86 6.43 9.98 3.38 13.13Zm-26.13 11.47c-1.19.9-5 2-5 2a27.49 27.49 0 0 1-5.19 1.25c-4.26.07-3.29-11.35-6.65-11.8-9.69-1.29 3.83-15.23 3.83-15.23s18.87 2.36 11.75 10.3c-2.31 2.55 4.75 10.83 1.26 13.48ZM362 509.45c-1.31.71-5.29 1.24-5.29 1.24a27.58 27.58 0 0 1-5.33.44c-4.21-.58-1.51-11.72-4.76-12.68-9.39-2.75 6.11-14.46 6.11-14.46s18.29 5.21 10 12c-2.58 2.11 3.11 11.38-.73 13.46Z" transform="translate(-121.62 -119.82)"/><circle class="cls-3" cx="207.34" cy="207.34" r="155.53"/></g>';
    }

    function _isPair(uint256 value) internal pure returns (bool) {
        return value % 2 == 0;
    }
}
