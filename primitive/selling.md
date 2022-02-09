# Selling

### Selling Options

**Want to adjust the price of your time?** From your profile you can select any NFT you own

* Price - Increase or decrease the price of your time
* Currency - Change the method of payment
* Whitelist - Add or remove buyers from the white list

![Non Fungible Time Update View](<../.gitbook/assets/NFT View.png>)

####

### Technical Method

{% hint style="info" %}
Change the price and currency of the token with the provided tokenID.
{% endhint %}

#### changeTokenBuyingConditions()

**`function changeTokenBuyingConditions(uint256 tokenId, address currency, uint256 price, bool forSale)`**



| Parameter Name |   Type  |                                          Description                                          |
| :------------: | :-----: | :-------------------------------------------------------------------------------------------: |
|  **`tokenId`** | uint256 |                                 TokenID of the NFT being sold.                                |
| **`currency`** | address | Address of the ERC-20 currency to be used for payment. Use address(0) to set native currency. |
|   **`price`**  | uint256 |                                  Price of the NFT being sold.                                 |
|  **`forSale`** |   bool  |                        Boolean indicating whether the NFT is for sale.                        |

####
