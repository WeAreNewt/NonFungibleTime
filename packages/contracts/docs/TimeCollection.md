# TimeCollection



> Tokenized time collection

Everything created can change a lot, we are still building it.

*Everything*

## Methods

### approve

```solidity
function approve(address to, uint256 tokenId) external nonpayable
```



*See {IERC721-approve}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined
| tokenId | uint256 | undefined

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```



*See {IERC721-balanceOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### buyToken

```solidity
function buyToken(uint256 tokenId) external payable
```



*Buys the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The token id of the NFT that you are buying

### changeTokenBuyingConditions

```solidity
function changeTokenBuyingConditions(uint256 tokenId, address currency, uint256 price) external nonpayable
```



*Changes the price and currency of the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | Token id of the NFT that you are selling
| currency | address | The address of the ERC-20 currency to use for the payment. Use address(0) to set native currency
| price | uint256 | Price of the NFT that you are selling

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address)
```



*See {IERC721-getApproved}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```



*See {IERC721-isApprovedForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined
| operator | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined

### isCurrencyAllowed

```solidity
function isCurrencyAllowed(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined

### mint

```solidity
function mint(string name, string description, string work, string time, string date, uint256 royalty) external nonpayable
```



*Mints a new token with the given parameters.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| name | string | Name of the NFT that you are minting
| description | string | Description of the NFT that you are minting
| work | string | Type of work that will be done of the NFT that you are minting
| time | string | Units of time to be redeemed of the NFT that you are minting
| date | string | Date of when the NFT will be redeemed of the NFT that you are minting
| royalty | uint256 | The royalty that you will keep as a minter as a fraction of 10000

### name

```solidity
function name() external view returns (string)
```



*See {IERC721Metadata-name}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```



*See {IERC721-ownerOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined

### redeem

```solidity
function redeem(uint256 tokenId) external nonpayable
```



*Redeems the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | Token id of the NFT that you are redeeming

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### royaltyInfo

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address, uint256)
```



*Gets the royalty information of the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The id of the token that you are checking
| salePrice | uint256 | The price of the NFT that should be used for royalty calculation

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address who will receive the royalties and the royalty amount for the given price
| _1 | uint256 | undefined

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) external nonpayable
```



*See {IERC721-safeTransferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined
| to | address | undefined
| tokenId | uint256 | undefined
| _data | bytes | undefined

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```



*See {IERC721-setApprovalForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined
| approved | bool | undefined

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*Checks if the contract supports the specified interface.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | The interface id of the interface that you are querying

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | True if the interface is supported, false otherwise

### symbol

```solidity
function symbol() external view returns (string)
```



*See {IERC721Metadata-symbol}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined

### toggleCurrencyAllowance

```solidity
function toggleCurrencyAllowance(address currency) external nonpayable
```



*Toggles the payment allowance of the given currency*

#### Parameters

| Name | Type | Description |
|---|---|---|
| currency | address | The address of the ERC-20 currency to toggle allowance. Use address(0) for native currency

### toggleForSale

```solidity
function toggleForSale(uint256 tokenId) external nonpayable
```



*Toggles the for sale status of the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | The number of rings from dendrochronological sample

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```



*Returns the URI of the token with the given tokenId.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | Token Id of the NFT that you are getting the URI

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | encoded token data in json format

### tokens

```solidity
function tokens(uint256) external view returns (uint256 tokenId, uint256 price, uint256 royalty, string name, string description, string work, string time, string date, bool redeemed, bool forSale, address payable mintedBy, address currency)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined
| price | uint256 | undefined
| royalty | uint256 | undefined
| name | string | undefined
| description | string | undefined
| work | string | undefined
| time | string | undefined
| date | string | undefined
| redeemed | bool | undefined
| forSale | bool | undefined
| mintedBy | address payable | undefined
| currency | address | undefined

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external nonpayable
```



*See {IERC721-transferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined
| to | address | undefined
| tokenId | uint256 | undefined

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| approved `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| operator `indexed` | address | undefined |
| approved  | bool | undefined |

### CurrencyAllowanceToggled

```solidity
event CurrencyAllowanceToggled(address indexed currency)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| currency `indexed` | address | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### TokenBought

```solidity
event TokenBought(uint256 indexed tokenId, address seller, address buyer)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId `indexed` | uint256 | undefined |
| seller  | address | undefined |
| buyer  | address | undefined |

### TokenForSaleToggled

```solidity
event TokenForSaleToggled(uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId `indexed` | uint256 | undefined |

### TokenPriceChanged

```solidity
event TokenPriceChanged(uint256 indexed tokenId, uint256 newPrice)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId `indexed` | uint256 | undefined |
| newPrice  | uint256 | undefined |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| tokenId `indexed` | uint256 | undefined |



## Errors

### AlreadyRedeemed

```solidity
error AlreadyRedeemed(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### CantBuyYourOwnToken

```solidity
error CantBuyYourOwnToken(address buyer, uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| buyer | address | undefined |
| tokenId | uint256 | undefined |

### InvalidAddress

```solidity
error InvalidAddress(address addr)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| addr | address | undefined |

### InvalidRoyalty

```solidity
error InvalidRoyalty()
```






### NotEnoughFunds

```solidity
error NotEnoughFunds(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### NotForSale

```solidity
error NotForSale(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### OnlyTokenOwner

```solidity
error OnlyTokenOwner(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### TokenDoesntExist

```solidity
error TokenDoesntExist(uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

### TransferFailed

```solidity
error TransferFailed()
```






### UnallowedCurrency

```solidity
error UnallowedCurrency(uint256 tokenId, address currency)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |
| currency | address | undefined |


