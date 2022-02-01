# Methods

#### mint()

**`function mint(string memory name, string memory description, string memory work, uint256 availabilityFrom, uint256 availabilityTo, uint256 duration, uint256 royaltyBasisPoints)`**

Mints a new token with the given parameters.

|                          |   Type  |                                     Description                                     |
| :----------------------: | :-----: | :---------------------------------------------------------------------------------: |
|        **`name`**        |  string |                            Name of the NFT being minted.                            |
|     **`description`**    |  string |                         Description of the NFT being minted.                        |
|        **`work`**        |  string |             Type of work that will be completed by the NFT being minted             |
|  **`availabilityFrom`**  | uint256 |  Unix timestamp indicating start of availability. Zero if there is no lower bound.  |
|   **`availabilityTo`**   | uint256 |   Unix timestamp indicating end of availability. Zero if there is no upper bound.   |
|      **`duration`**      | uint256 |     The total time tokenized within the availability range. Measured in seconds.    |
| **`royaltyBasisPoints`** | uint256 | The royalty percentage measured in basis points. Each basis point represents 0.01%. |

#### buyToken()

**`function buyToken(uint256 tokenId)`**

Purchases token based on the provided tokenID.

| Parameter Name | Type    | Description                             |
| -------------- | ------- | --------------------------------------- |
| **`tokenId`**  | uint256 | The tokenID of the NFT being purchased. |

#### changeTokenBuyingConditions()

**`function changeTokenBuyingConditions(uint256 tokenId, address currency, uint256 price, bool forSale)`**

Changes the price and currency of the token with the provided tokenID.

| Parameter Name |   Type  |                                          Description                                          |
| :------------: | :-----: | :-------------------------------------------------------------------------------------------: |
|  **`tokenId`** | uint256 |                                 TokenID of the NFT being sold.                                |
| **`currency`** | address | Address of the ERC-20 currency to be used for payment. Use address(0) to set native currency. |
|   **`price`**  | uint256 |                                  Price of the NFT being sold.                                 |
|  **`forSale`** |   bool  |                        Boolean indicating whether the NFT is for sale.                        |

#### redeem()

**`function redeem(uint256 tokenId)`**

Redeems the token with the provided tokenID.

| Parameter Name |   Type  |             Description            |
| :------------: | :-----: | :--------------------------------: |
|  **`tokenId`** | uint256 | TokenID of the NFT being redeemed. |

#### toggleCurrencyAllowance()

**`function toggleCurrencyAllowance(address currency)`**

Toggle for the allowance of the given currency (ERC-20).

| Parameter Name |   Type  |                               Description                               |
| :------------: | :-----: | :---------------------------------------------------------------------: |
| **`currency`** | address | The address of the ERC-20 currency. Use address(0) for native currency. |

#### royaltyInfo()

**`function royaltyInfo(uint256 tokenId, uint256 salePrice)`**

Retrieves the royalty information of the NFT with the provided tokenID.

|  Parameter Name |   Type  |                         Description                        |
| :-------------: | :-----: | :--------------------------------------------------------: |
|  **`tokenId`**  | uint256 |                   The tokenID of the NFT.                  |
| **`salePrice`** | uint256 | The price of the NFT that is used for royalty calculation. |

#### supportsInterface()

**`function supportsInterface(bytes4 interfaceId)`**

Checks if the contract supports the specified interface.

|   Parameter Name  |  Type  |                        Description                       |
| :---------------: | :----: | :------------------------------------------------------: |
| **`interfaceId`** | bytes4 | The interface ID of the interface that you are querying. |

#### tokenURI()

**`function tokenURI(uint256 tokenId)`**

Returns the URI of the token with the provided tokenID

|   Parameter Name   |   Type   |       Description       |
| :----------------: | :------: | :---------------------: |
| **Parameter Name** | **Type** |     **Description**     |
|    **`tokenId`**   |  uint256 | The tokenID of the NFT. |

#### \_transferCurrency()

**`function _transferCurrency(address sender, address payable receiver, address currency, uint256 amount)`**

Transfers the given amount of the provided currency from sender to receiver.

| Parameter Name |   Type  |                                Description                                |
| :------------: | :-----: | :-----------------------------------------------------------------------: |
|  **`sender`**  | address |                         The address of the sender.                        |
| **`receiver`** | address |                        The address of the receiver.                       |
| **`currency`** | address | The currency to use for the transfer. Use address(0) for native currency. |
|  **`amount`**  | uint256 |                          The amount to transfer.                          |

#### \_areValidTimeParams()

**`function _areValidTimeParams( uint256 availabilityFrom, uint256 availabilityTo, uint256 duration)`**

Tells whether the given params conform a valid time representation or not.

{% hint style="warning" %} Duration must be greater than zero.

If the availability range is bounded on both ends then:

* availabilityTo is greater than availabilityFrom
* duration is less than or equal to (availabilityTo - availabilityFrom) {% endhint %}

|     Parameter Name     |   Type  |                                    Description                                    |
| :--------------------: | :-----: | :-------------------------------------------------------------------------------: |
| **`availabilityFrom`** | uint256 | Unix timestamp indicating start of availability. Zero if there is no lower bound. |
|  **`availabilityTo`**  | uint256 |  Unix timestamp indicating end of availability. Zero if there is no upper bound.  |
|     **`duration`**     | uint256 |   The quantity of time tokenized within availability range. Measured in seconds.  |
