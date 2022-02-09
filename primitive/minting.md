# Minting

### Mint Your Time

**Provide services?** Start by minting a token with attributes that represent your offering.

* Name - The laborers name
* Description - A description of the services provided
* Category - Classify the work so that it can be searched
* Number of Hours - The amount of time assigned to the token
* Beginning of Availability (optional) - When the token can begin to be purchased
* End of Availability (optional) - When the token is no longer for sale
* Royalties (%) - The royalties due to you when your time is exchanged

![Non Fungible Time Minting View](../.gitbook/assets/Mint.png)

### Technical Method

{% hint style="info" %}
Mint a new token with given parameters.
{% endhint %}

#### mint()

**`function mint(string memory name, string memory description, string memory work, uint256 availabilityFrom, uint256 availabilityTo, uint256 duration, uint256 royaltyBasisPoints)`**

|                          |   Type  |                                     Description                                     |
| :----------------------: | :-----: | :---------------------------------------------------------------------------------: |
|        **`name`**        |  string |                            Name of the NFT being minted.                            |
|     **`description`**    |  string |                         Description of the NFT being minted.                        |
|        **`work`**        |  string |             Type of work that will be completed by the NFT being minted             |
|  **`availabilityFrom`**  | uint256 |  Unix timestamp indicating start of availability. Zero if there is no lower bound.  |
|   **`availabilityTo`**   | uint256 |   Unix timestamp indicating end of availability. Zero if there is no upper bound.   |
|      **`duration`**      | uint256 |     The total time tokenized within the availability range. Measured in seconds.    |
| **`royaltyBasisPoints`** | uint256 | The royalty percentage measured in basis points. Each basis point represents 0.01%. |

####
