// a collection of utils for signing ERC721.permit()

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber as BN, BigNumberish, constants, Signature, Contract, utils } from "ethers";
import { splitSignature } from "ethers/lib/utils";

export async function getErc721PermitSignature(
  owner: SignerWithAddress,
  nftContract: Contract,
  spender: string,
  tokenID: BigNumberish,
  deadline: BigNumberish = constants.MaxUint256,
  nonce: BigNumberish = constants.MaxUint256 // optional override. leave empty to use correct nonce
): Promise<Signature> {
  // get nonce if not given
  let nonceBN = BN.from(nonce);
  if(nonceBN.eq(constants.MaxUint256)) {
    nonceBN = await nftContract.nonces(tokenID);
  }
  // get other vars
  const [name, version, chainId] = await Promise.all([
    nftContract.name(),
    "1",
    owner.getChainId(),
  ]);
  // split v, r, s
  return splitSignature(
    // sign message
    await owner._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: nftContract.address,
      },
      {
        Permit: [
          { name: "spender",  type: "address", },
          { name: "tokenID",  type: "uint256", },
          { name: "nonce",    type: "uint256", },
          { name: "deadline", type: "uint256", },
        ],
      },
      {
        owner: owner.address,
        spender,
        tokenID,
        nonce: nonceBN,
        deadline,
      }
    )
  );
}

export function assembleRSV(r: string, s: string, v: number) {
  let v_ = Number(v).toString(16);
  let r_ = r.slice(2);
  let s_ = s.slice(2);
  return `0x${r_}${s_}${v_}`;
}

// Gets the EIP712 domain separator
export function getDomainSeparator(name: string, contractAddress: string, chainId: number) {
    return utils.keccak256(
        utils.defaultAbiCoder.encode(
        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
        [
            utils.keccak256(utils.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
            utils.keccak256(utils.toUtf8Bytes(name)),
            utils.keccak256(utils.toUtf8Bytes("1")),
            chainId,
            contractAddress,
        ]
        )
    )
}
