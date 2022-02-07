// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import '../interfaces/ISvgGenerator.sol';

contract MiddleRingsSvgGenerator is ISvgGenerator {
    /// @inheritdoc ISvgGenerator
    function generateSvg(
        uint256 tokenId,
        address,
        string calldata,
        string calldata,
        uint256,
        uint256 availabilityTo,
        uint256,
        bool,
        bool
    ) external pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    (availabilityTo + tokenId) % 2 == 0
                        ? '<g id="Ring3" class="rotation-3"><g><g><polygon class="cls-5" points="203.05 316.67 194.64 340.67 192.12 315.87 203.05 316.67"/><polygon class="cls-5" points="182.72 347.84 182.22 326.78 168.85 344.57 182.72 347.84"/><path class="cls-5" d="M322.23,437.65" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="169.33 310 153.92 330.22 159.18 305.86 169.33 310"/><polygon class="cls-5" points="140.36 333.36 146.39 313.17 128.18 325.96 140.36 333.36"/><path class="cls-5" d="M287.91,430.43" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="139.32 293.23 118.42 307.7 130.95 286.16 139.32 293.23"/><polygon class="cls-5" points="104.56 306.49 116.53 289.16 95.25 295.7 104.56 306.49"/><path class="cls-5" d="M257.51,413" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="115.97 268.01 91.61 275.31 110.19 258.7 115.97 268.01"/><polygon class="cls-5" points="78.8 269.88 95.55 257.1 73.29 256.74 78.8 269.88"/><path class="cls-5" d="M234,386.94" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="101.55 236.81 76.13 236.22 98.93 226.17 101.55 236.81"/><polygon class="cls-5" points="65.63 227.1 85.5 220.12 64.44 212.9 65.63 227.1"/><path class="cls-5" d="M219.66,354.93" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="97.48 202.68 73.48 194.27 98.28 191.75 97.48 202.68"/><polygon class="cls-5" points="66.31 182.35 87.37 181.84 69.58 168.48 66.31 182.35"/><path class="cls-5" d="M215.93,320.06" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="104.15 168.96 83.93 153.54 108.29 158.81 104.15 168.96"/><polygon class="cls-5" points="80.79 139.99 100.98 146.02 88.19 127.81 80.79 139.99"/><path class="cls-5" d="M223.16,285.74" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="120.92 138.95 106.45 118.05 127.99 130.58 120.92 138.95"/><polygon class="cls-5" points="107.65 104.19 124.99 116.16 118.45 94.88 107.65 104.19"/><path class="cls-5" d="M240.63,255.34" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="146.14 115.6 138.84 91.24 155.45 109.82 146.14 115.6"/><polygon class="cls-5" points="144.27 78.43 157.05 95.17 157.41 72.92 144.27 78.43"/><path class="cls-5" d="M266.65,231.82" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="177.34 101.18 177.92 75.76 187.98 98.56 177.34 101.18"/><polygon class="cls-5" points="187.04 65.25 194.03 85.13 201.25 64.07 187.04 65.25"/><path class="cls-5" d="M298.66,217.49" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="211.47 97.11 219.88 73.11 222.4 97.91 211.47 97.11"/><polygon class="cls-5" points="231.8 65.94 232.3 87 245.67 69.21 231.8 65.94"/><path class="cls-5" d="M333.53,213.76" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="245.19 103.78 260.6 83.56 255.34 107.92 245.19 103.78"/><polygon class="cls-5" points="274.16 80.42 268.13 100.61 286.34 87.81 274.16 80.42"/><path class="cls-5" d="M367.85,221" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="275.19 120.55 296.1 106.08 283.57 127.62 275.19 120.55"/><polygon class="cls-5" points="309.96 107.28 297.99 124.61 319.26 118.08 309.96 107.28"/><path class="cls-5" d="M398.25,238.46" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="298.55 145.77 322.91 138.47 304.33 155.08 298.55 145.77"/><polygon class="cls-5" points="335.72 143.9 318.97 156.68 341.23 157.04 335.72 143.9"/><path class="cls-5" d="M421.77,264.48" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="312.97 176.97 338.39 177.55 315.59 187.61 312.97 176.97"/><polygon class="cls-5" points="348.89 186.67 329.02 193.66 350.07 200.88 348.89 186.67"/><path class="cls-5" d="M436.09,296.49" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="317.04 211.1 341.04 219.51 316.24 222.03 317.04 211.1"/><polygon class="cls-5" points="348.21 231.43 327.15 231.93 344.94 245.3 348.21 231.43"/><path class="cls-5" d="M439.83,331.36" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="310.37 244.82 330.59 260.23 306.23 254.97 310.37 244.82"/><polygon class="cls-5" points="333.73 273.79 313.54 267.76 326.33 285.97 333.73 273.79"/><path class="cls-5" d="M432.6,365.67" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="293.6 274.82 308.07 295.73 286.53 283.2 293.6 274.82"/><polygon class="cls-5" points="306.87 309.59 289.53 297.62 296.07 318.89 306.87 309.59"/><path class="cls-5" d="M415.12,396.08" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="268.38 298.18 275.68 322.54 259.07 303.96 268.38 298.18"/><polygon class="cls-5" points="270.25 335.34 257.47 318.6 257.11 340.86 270.25 335.34"/><path class="cls-5" d="M389.11,419.6" transform="translate(-120.62 -118.82)"/></g><g><polygon class="cls-5" points="237.18 312.6 236.6 338.02 226.54 315.21 237.18 312.6"/><polygon class="cls-5" points="227.47 348.52 220.49 328.65 213.27 349.7 227.47 348.52"/><path class="cls-5" d="M357.1,433.92" transform="translate(-120.62 -118.82)"/></g></g><circle class="cls-3" cx="207.34" cy="207.34" r="144.22"/></g>'
                        : '<g id="Ring3" class="rotation-3"><circle class="cls-2" cx="206.34" cy="206.34" r="144.22"/><path class="cls-5-2" d="m340.85 436.1.81 18.54a6.94 6.94 0 0 1-7 6.94h-15.27a6.94 6.94 0 0 1-6.94-6.94l.93-19.3" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="M219.32 327.09H191.9m21.84-.54-.17-9.67m-16.43 9.67-.08-10.3m8.55 9.65v-9.19"/><ellipse class="cls-5-2" cx="327.13" cy="466.57" rx="6.75" ry="1" transform="rotate(-.86 -7716.464 8508.794)"/><path class="cls-5-2" d="m310.79 435.6-4.23 18.07a6.93 6.93 0 0 1-8.55 4.81l-14.76-4.13a6.94 6.94 0 0 1-4.81-8.56l6.11-18.33" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m186.34 326.22-26.4-7.4m21.18 5.37 2.44-9.36m-18.43 4.88 2.7-9.94m5.63 11.6 2.48-8.85"/><ellipse class="cls-5-2" cx="289.36" cy="461.24" rx="1" ry="6.75" transform="rotate(-75.21 150.755 480.273)"/><path class="cls-5-2" d="m282 427-9 16.27a7 7 0 0 1-9.54 2.32l-13.1-8a7 7 0 0 1-2.32-9.54l10.83-16" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m154.82 316.47-23.43-14.25m18.95 10.89 4.88-8.36m-19.07-.27 5.28-8.84m2.3 12.69 4.77-7.86"/><ellipse class="cls-5-2" cx="254.43" cy="445.91" rx="1" ry="6.75" transform="rotate(-59.56 88.886 492.244)"/><path class="cls-5-2" d="m256.55 411-13 13.24a7 7 0 0 1-9.82-.33l-10.46-11.2a7 7 0 0 1 .34-9.82l14.74-12.49" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m127.1 298.58-18.72-20.04m15.31 15.59 6.95-6.72M112.36 282l7.47-7.09m-1.22 12.84 6.72-6.27"/><ellipse class="cls-5-2" cx="224.92" cy="421.73" rx="1" ry="6.75" transform="rotate(-43.9 15.486 512.73)"/><path class="cls-5-2" d="m236.4 388.64-16.08 9.25a6.93 6.93 0 0 1-9.36-3l-7.05-13.61a6.92 6.92 0 0 1 3-9.35l17.56-8" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m105.23 273.88-12.62-24.35m10.54 19.15 8.51-4.6m-16.15-10.14 9.11-4.81m-4.64 12.03 8.16-4.23"/><ellipse class="cls-5-2" cx="203.04" cy="390.49" rx="1" ry="6.75" transform="rotate(-28.25 -95.828 572.226)"/><path class="cls-5-2" d="m223 361.72-18 4.57a6.94 6.94 0 0 1-8.21-5.39l-3.11-15a6.94 6.94 0 0 1 5.38-8.21l19.09-3" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m90.84 244.19-5.58-26.84m4.97 21.27 9.44-2.14m-12.81-14.11 10.07-2.18m-7.71 10.34 9-1.87"/><ellipse class="cls-5-2" cx="190.4" cy="354.49" rx="1" ry="6.75" transform="rotate(-12.6 -413.074 845.37)"/><path class="cls-5-2" d="m217.4 332.19-18.55-.46a7 7 0 0 1-6.46-7.4l1.05-15.33a6.93 6.93 0 0 1 7.4-6.45l19.16 2.29" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m84.99 211.72 1.87-27.35m-.95 21.82 9.66.49m-8.53-17.05 10.29.62m-10.22 7.88 9.17.62"/><ellipse class="cls-5-2" cx="187.93" cy="316.43" rx="6.75" ry="1" transform="rotate(-86.95 63.924 320.647)"/><path class="cls-5-2" d="m220 302.23-17.74-5.44a7 7 0 0 1-4.22-8.87l5.14-14.44a6.94 6.94 0 0 1 8.86-4.22l17.88 7.35" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m88.12 178.88 9.18-25.84m-6.8 20.77 9.17 3.07m-3.62-18.72 9.74 3.37m-11.96 4.83 8.66 3.08"/><ellipse class="cls-5-2" cx="195.83" cy="279.1" rx="6.75" ry="1" transform="rotate(-71.29 51.501 303.996)"/><path class="cls-5-2" d="m230.49 274.07-15.61-10a6.94 6.94 0 0 1-1.67-9.67l8.84-12.52a6.94 6.94 0 0 1 9.67-1.67L247 252.08" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m99.99 148.1 15.81-22.4m-12.15 18.15 8 5.44m1.57-19 8.47 5.87m-12.82 1.43 7.51 5.3"/><ellipse class="cls-5-2" cx="213.51" cy="245.3" rx="6.75" ry="1" transform="rotate(-55.64 39.177 300.634)"/><path class="cls-5-2" d="m248.24 249.8-12.33-13.86a7 7 0 0 1 1-9.77l11.89-9.67a7 7 0 0 1 9.77 1L270 233.06" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m119.73 121.66 21.27-17.3m-16.6 14.2 6.23 7.4m6.64-17.88 6.57 7.94m-12.73-2.09 5.8 7.13"/><ellipse class="cls-5-2" cx="239.65" cy="217.51" rx="6.75" ry="1" transform="rotate(-39.99 14.197 324.731)"/><path class="cls-5-2" d="m271.87 231.22-8.13-16.68a7 7 0 0 1 3.61-9.13l14-6.11a7 7 0 0 1 9.14 3.6l6.88 18.1" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m145.86 101.53 25.15-10.93m-19.81 9.2 4.01 8.81m11.21-15.42 4.18 9.41m-11.69-5.44 3.67 8.43"/><ellipse class="cls-5-2" cx="272.31" cy="197.81" rx="6.75" ry="1" transform="rotate(-24.34 -66.309 419.862)"/><path class="cls-5-2" d="m299.65 219.71-3.33-18.26a6.94 6.94 0 0 1 5.93-7.82l15.18-2.09a7 7 0 0 1 7.83 5.94l1.7 19.25" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m176.46 89.2 27.17-3.74m-21.57 3.51 1.49 9.56m14.96-11.82 1.49 10.2m-9.79-8.4 1.25 9.11"/><ellipse class="cls-5-2" cx="309.08" cy="187.65" rx="6.75" ry="1" transform="rotate(-8.69 -540.366 927.979)"/><path class="cls-5-2" d="m329.5 216.11 1.72-18.47a6.93 6.93 0 0 1 7.82-5.93l15.18 2.08a7 7 0 0 1 5.94 7.83l-3.56 19" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m209.26 85.57 27.16 3.74m-21.71-2.44-1.15 9.61m17.6-7.35-1.33 10.22m-7.15-10.73-1.25 9.11"/><ellipse class="cls-5-2" cx="347.23" cy="187.79" rx="1" ry="6.75" transform="rotate(-83.03 218.763 196.579)"/><path class="cls-5-2" d="m359.21 220.71 6.64-17.33a6.94 6.94 0 0 1 9.14-3.6l14.05 6.1a6.94 6.94 0 0 1 3.6 9.14l-8.54 17.33" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m241.81 90.94 25.15 10.92m-20.25-8.2-3.7 8.94m18.93-2.33-4.03 9.48m-4-12.26-3.66 8.43"/><ellipse class="cls-5-2" cx="383.93" cy="198.22" rx="1" ry="6.75" transform="rotate(-67.38 233.26 229.52)"/><path class="cls-5-2" d="m386.58 233.14 11.07-14.89a7 7 0 0 1 9.77-1l11.89 9.67a7 7 0 0 1 1 9.77l-12.91 14.38" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m271.71 104.88 21.27 17.31m-17.28-13.36-5.98 7.61m18.85 2.86-6.43 8.04m-.55-12.88-5.8 7.13"/><ellipse class="cls-5-2" cx="416.45" cy="218.16" rx="1" ry="6.75" transform="rotate(-51.73 232.06 283.683)"/><path class="cls-5-2" d="m409.58 252.51 14.68-11.36a7 7 0 0 1 9.68 1.67l8.83 12.52a6.94 6.94 0 0 1-1.67 9.66l-16.3 10.36" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m296.74 126.38 15.81 22.4m-13.04-17.53-7.8 5.72m17.38 7.84-8.37 6.01m2.95-12.55-7.51 5.3"/><ellipse class="cls-5-2" cx="442.38" cy="246.14" rx="1" ry="6.75" transform="rotate(-36.08 197.588 372.92)"/><path class="cls-5-2" d="m426.51 277.36 17.19-7a7 7 0 0 1 8.87 4.22L457.7 289a6.94 6.94 0 0 1-4.22 8.87L435 303.49" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m315.04 153.83 9.18 25.84m-7.82-20.4-9.06 3.4m14.62 12.24-9.68 3.53m6.23-11.29-8.66 3.07"/><ellipse class="cls-5-2" cx="459.81" cy="280.07" rx="1" ry="6.75" transform="rotate(-20.42 66.483 557.834)"/><path class="cls-5-2" d="m436.1 305.85 18.44-2.07a6.93 6.93 0 0 1 7.4 6.45l1 15.29a6.93 6.93 0 0 1-6.45 7.4l-19.32.38" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m325.26 185.2 1.87 27.36m-2.04-21.76-9.63.83m10.77 15.73-10.27.79m9.04-9.19-9.17.63"/><ellipse class="cls-5-2" cx="467.43" cy="317.45" rx="1" ry="6.75" transform="rotate(-4.77 -1031.545 1717.701)"/><path class="cls-5-2" d="m437.65 335.87 18.31 3a6.94 6.94 0 0 1 5.39 8.21l-3.12 15a6.94 6.94 0 0 1-8.21 5.38l-18.71-4.84" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m326.63 218.16-5.58 26.85m3.91-21.5-9.5-1.8m6.13 18.06-10.11-2.02m11.19-6.41-9-1.87"/><ellipse class="cls-5-2" cx="464.69" cy="355.5" rx="6.75" ry="1" transform="rotate(-79.12 331.362 369.203)"/><path class="cls-5-2" d="m431 365.2 16.87 7.8a6.94 6.94 0 0 1 3 9.36l-7 13.61a7 7 0 0 1-9.36 3l-16.7-9.71" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m319.06 250.27-12.61 24.35m9.56-19.64-8.67-4.3m1.03 19.04-9.18-4.67m12.5-3.15-8.16-4.23"/><ellipse class="cls-5-2" cx="451.78" cy="391.4" rx="6.75" ry="1" transform="rotate(-63.47 294.09 429.808)"/><path class="cls-5-2" d="m416.76 391.66 14.1 12.06a6.94 6.94 0 0 1 .34 9.82l-10.46 11.2a6.94 6.94 0 0 1-9.81.33l-13.47-13.86" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m303.11 279.15-18.72 20.04m14.51-16.33-7.19-6.48m-4.14 18.61-7.58-6.97m12.89.34-6.72-6.27"/><ellipse class="cls-5-2" cx="429.67" cy="422.48" rx="6.75" ry="1" transform="rotate(-47.82 233.692 499.713)"/><path class="cls-5-2" d="m395.88 413.29 10.32 15.42a7 7 0 0 1-2.32 9.54l-13.1 8a7 7 0 0 1-9.54-2.32l-9.23-17" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m279.95 302.66-23.42 14.24m18.37-11.81-5.17-8.17m-9.01 16.8-5.42-8.76m12.32 3.8-4.78-7.85"/><ellipse class="cls-5-2" cx="399.99" cy="446.45" rx="6.75" ry="1" transform="rotate(-32.16 131.407 597.541)"/><path class="cls-5-2" d="m369.93 428.48 5.78 17.63a6.94 6.94 0 0 1-4.81 8.56l-14.76 4.13a6.94 6.94 0 0 1-8.56-4.81l-4.3-18.84" transform="translate(-121.62 -119.82)"/><path class="cls-5-2" d="m251.32 319.04-26.41 7.4m20.89-6.42-2.78-9.26m-13.21 13.74-2.85-9.89m10.83 6.98-2.48-8.85"/><ellipse class="cls-5-2" cx="364.95" cy="461.52" rx="6.75" ry="1" transform="rotate(-16.51 -108.738 820.799)"/></g>'
                )
            );
    }
}