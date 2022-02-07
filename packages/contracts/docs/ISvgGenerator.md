# ISvgGenerator









## Methods

### generateSvg

```solidity
function generateSvg(uint256 tokenId, address minter, string category, string name, uint256 availabilityFrom, uint256 availabilityTo, uint256 duration, bool redeemed, bool forSale) external view returns (string)
```



*Generates an SVG from the given data.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The ID of the token for which the SVG will be generated.
| minter | address | The minter of the token.
| category | string | Type or category label that represents the activity for what the time was tokenized.
| name | string | Name of the NFT.
| availabilityFrom | uint256 | Unix timestamp indicating start of availability. Zero if does not have lower bound.
| availabilityTo | uint256 | Unix timestamp indicating end of availability. Zero if does not have upper bound.
| duration | uint256 | The actual quantity of time you are tokenizing inside availability range. Measured in seconds.
| redeemed | bool | A boolean representing if the token was already redeemed or not.
| forSale | bool | A boolean representing if the token is for sale or not.

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | A string representing the generated SVG.




