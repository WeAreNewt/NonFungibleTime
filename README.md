---
description: What is it and why should we tokenize our time?
---

# Non Fungible Time

{% hint style="info" %}
Non Fungible Time is a Proof Of Concept
{% endhint %}

### Web3 Is Empowering

In Web 2, reputations are limited to the platforms they are built on. Employment history is owned by the employer. The collateral you can demand against your future production is subject to bias.

- [Non Fungible Time](#non-fungible-time)
  - [Contents](#contents)
  - [Project Details](#project-details)
    - [About](#about)
    - [Infrastructure](#infrastructure)
    - [Buidling](#buidling)
  - [Smart Contracts](#smart-contracts)
    - [NonFungibleTimeCollection](#nonfungibletimecollection)
      - [mint()](#mint)
      - [buyToken()](#buytoken)
      - [changeTokenBuyingConditions()](#changetokenbuyingconditions)
      - [redeem()](#redeem)
      - [toggleCurrencyAllowance()](#togglecurrencyallowance)
      - [tokenURI()](#tokenuri)
      - [tokens()](#tokens)
    - [SvgGenerator](#svggenerator)
  - [Frontend](#frontend)
  - [Subgraph](#subgraph)
  - [Audit](#audit)
  - [License](#license)

Delivering top quality work and high levels of production is a virtuous cycle with Non Fungible Time and _only you can define your own limitations_.

### The 3 Primary Branches Of The WorkFi Economy

Non Fungible Time is a WorkFi primitive. The functions are stripped down to their most basic attributes. They are a universal format for exchanging human collateral on a decentralized network. Developers can build applications on top of the primitive to mint and exchange time in dynamic ways that serves any unique use case, while workers can move their minted time

**1) Minting** platforms that workers use to represent their time as a Non Fungible Token.

> Examples: DAO Contributors, Consultants,  Engineers, Designers, Professionals.
>
> _Produce a non fungible token that secures your service._

**2) Markets** that connect buyers with minters of time

> Examples: DAO Services Market, Rideshare/Delivery Apps, Professional Scheduling &#x20;
>
> _Deliver the best matching experience to customers with while optimizing labor utility_

**3) Collateral** solutions for producers of time and yield opportunities for liquidity providers.

> Examples: Lending and Borrowing, Insurance Products, Aggregated Labor &#x20;
>
> _Smart contracts that allocate time efficiently and maximize its value._

{% hint style="info" %}
Newt developed the base contracts for minting and exchanging, and is supporting efforts to build on top of them.
{% endhint %}

The smart contracts store the NFT collection (ERC-721) on the blockchain - with the reference implementation being deployed to the Polygon network. This package uses the hardhat framework for contract development and deployment.
    
### NonFungibleTimeCollection

{% content-ref url="primitive/minting.md" %}
[minting.md](primitive/minting.md)
{% endcontent-ref %}

{% content-ref url="primitive/selling.md" %}
[selling.md](primitive/selling.md)
{% endcontent-ref %}

{% content-ref url="primitive/market.md" %}
[market.md](primitive/market.md)
{% endcontent-ref %}

{% content-ref url="primitive/redeem.md" %}
[redeem.md](primitive/redeem.md)
{% endcontent-ref %}

### [Use Case: Examples ](broken-reference)

{% content-ref url="use-case/markets.md" %}
[markets.md](use-case/markets.md)
{% endcontent-ref %}

{% content-ref url="use-case/reputations.md" %}
[reputations.md](use-case/reputations.md)
{% endcontent-ref %}

{% content-ref url="use-case/collateral.md" %}
[collateral.md](use-case/collateral.md)
{% endcontent-ref %}

{% content-ref url="use-case/guilds.md" %}
[guilds.md](use-case/guilds.md)
{% endcontent-ref %}

### [Building: Incentives and New Constructs](broken-reference)

{% content-ref url="building/workfi.md" %}
[workfi.md](building/workfi.md)
{% endcontent-ref %}

{% content-ref url="building/team.md" %}
[team.md](building/team.md)
{% endcontent-ref %}

{% content-ref url="building/rewards.md" %}
[rewards.md](building/rewards.md)
{% endcontent-ref %}

Changes the price and currency of the token with the provided tokenID.

|   Parameter Name   |  Type   |                                          Description                                          |
| :----------------: | :-----: | :-------------------------------------------------------------------------------------------: |
|   **`tokenId`**    | uint256 |                                TokenID of the NFT being sold.                                 |
|   **`currency`**   | address | Address of the ERC-20 currency to be used for payment. Use address(0) to set native currency. |
|    **`price`**     | uint256 |                                 Price of the NFT being sold.                                  |
|   **`forSale`**    |  bool   |                        Boolean indicating whether the NFT is for sale.                        |
| **`allowedBuyer`** | address |  Address of the buyer to avoid frontruns. Use address(0) to enable everyone to buy the NFT.   |

#### redeem()

**`function redeem(uint256 tokenId)`**

Redeems the token with the provided tokenID.

| Parameter Name |  Type   |            Description             |
| :------------: | :-----: | :--------------------------------: |
| **`tokenId`**  | uint256 | TokenID of the NFT being redeemed. |

#### toggleCurrencyAllowance()

**`function toggleCurrencyAllowance(address currency)`**

Toggle for the allowance of the given currency (ERC-20) as a payment token. Can only called by contract owner.

| Parameter Name |  Type   |                               Description                               |
| :------------: | :-----: | :---------------------------------------------------------------------: |
| **`currency`** | address | The address of the ERC-20 currency. Use address(0) for native currency. |

#### tokenURI()

**`function tokenURI(uint256 tokenId)`**

Returns the URI (on-chain SVG) of the token with the provided tokenID

| Parameter Name |  Type   |       Description       |
| :------------: | :-----: | :---------------------: |
| **`tokenId`**  | uint256 | The tokenID of the NFT. |

#### tokens()

**`function tokena(uint256 tokenId)`**

Returns token object for a specified

| Parameter Name |  Type   |       Description       |
| :------------: | :-----: | :---------------------: |
| **`tokenId`**  | uint256 | The tokenID of the NFT. |

| Returns |  T ype  |                                                    Description                                                    |
| :-----: | :-----: | :---------------------------------------------------------------------------------------------------------------: |
|    0    | uint256 |                Unix timestamp indicating start of availability. Zero if does not have lower bound.                |
|    1    | uint256 |                 Unix timestamp indicating end of availability. Zero if does not have upper bound.                 |
|    2    | uint256 |          The actual quantity of time you are tokenizing inside availability range. Measured in seconds.           |
|    3    | uint256 |                                   Price to purchase NFT, in `currency` decimals                                   |
|    4    | uint256 |                The royalty percentage measured in basis points. Each basis point represents 0.01%.                |
|    5    | address |                                           The address of token minter.                                            |
|    6    | address |                          The address which receives royalty payout from secondary sales.                          |
|    7    | address |                The address of payment toke. Use address(0) for native currency (ETH, MATIC, etc.).                |
|    8    | address | Address approved to purchase this NFT if reserved for a single buyer. address(0) enables everyone to buy the NFT. |
|    9    |  bool   |                             A boolean representing if the token was redeemed or not.                              |
|   10    |  bool   |                                A boolean indicating if the NFT is for sale or not.                                |
|   11    | string  |                                                 Name of the NFT.                                                  |
|   12    | string  |                                              Description of the NFT.                                              |
|   13    | string  |                           Category label, defines the type of service being tokenized.                            |

</details>
    
### SvgGenerator

The [SvgGenerator.sol](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/contracts/svg-generators) generates and stores the on-chain svg for each NFT, which is updated once an NFT is redeemed

To generate contract abis and typechain artifacts:

```sh
npm install
npx hardhat compile
```

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/docs/NonFungibleTimeCollection.md)

<br />

## Frontend

Main features of the frontend are creating, discovering, purchasing, and redeeming time NFTs

Frontend is build with React + TailwindCSS

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/frontend/README.md)

<br />

## Subgraph

The subgraph indexes data and provides access to a graphQL endpoint from blockchain data

There is a corresponding subgraph for each network the collection contract is deployed to

The playground links below allow you to view and query the subgraph schema directly from your browser and provide the links for the api endpoint:

- [Mumbai Subgraph](https://thegraph.com/hosted-service/subgraph/wearenewt/non-fungible-time-mumbai)

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/subgraph/README.md)

## Audit

You can find the full audit report from Peckshield under the [audits folder]((https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/audits)) and [here](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/audit/PeckShield-Audit-Report-TimeNFT-v1.0rc.pdf)

## License

[Link to code license](LICENSE.md)
