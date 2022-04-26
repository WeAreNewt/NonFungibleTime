// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.4;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import './../interfaces/IERC1271.sol';

/// @title ERC721PermittableUpgradeable
/// @author The Newt team.
/// @notice An extension of `ERC721`.
/// The base is OpenZeppelin's `ERC721Upgradeable` which also includes the `Metadata` extension. This extension includes simpler transfers and gasless approvals.
contract ERC721PermittableUpgradeable is ERC721Upgradeable, EIP712Upgradeable {

    /// @dev The nonces used in the permit signature verification.
    /// tokenID => nonce
    mapping(uint256 => uint256) private _nonces;

    /// @dev Value is equal to keccak256('Permit(address spender,uint256 tokenID,uint256 nonce,uint256 deadline)');
    // solhint-disable-next-line var-name-mixedcase
    bytes32 private immutable _PERMIT_TYPEHASH = 0x137406564cdcf9b40b1700502a9241e87476728da7ae3d0edfcf0541e5b49b3e;


    /// @notice Initializes the `ERC721Enhanced` contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    // solhint-disable-next-line func-name-mixedcase
    function __ERC721PermittableUpgradeable_init(string memory name, string memory symbol) internal onlyInitializing {
        __ERC721_init(name, symbol);
        __EIP712_init_unchained(name, '1');
    }

    // solhint-disable-next-line func-name-mixedcase
    function __ERC721Enhanced_init_unchained() internal onlyInitializing { }

    /***************************************
    SIMPLER TRANSFERS
    ***************************************/


    /// @notice Transfers `tokenID` from `msg.sender` to `to`.
    /// @dev This was excluded from the official `ERC721` standard in favor of `transferFrom(address from, address to, uint256 tokenID)`. We elect to include it.
    /// @param to The receipient of the token.
    /// @param tokenID The token to transfer.
    function transfer(address to, uint256 tokenID) public {
        super.transferFrom(msg.sender, to, tokenID);
    }

    /// @notice Safely transfers `tokenID` from `msg.sender` to `to`.
    /// @dev This was excluded from the official `ERC721` standard in favor of `safeTransferFrom(address from, address to, uint256 tokenID)`. We elect to include it.
    /// @param to The receipient of the token.
    /// @param tokenID The token to transfer.
    function safeTransfer(address to, uint256 tokenID) public {
        super.safeTransferFrom(msg.sender, to, tokenID, '');
    }

    /***************************************
    GASLESS APPROVALS
    ***************************************/

    /// @notice Approve of a specific `tokenID` for spending by `spender` via signature.
    /// @param spender The account that is being approved.
    /// @param tokenID The ID of the token that is being approved for spending.
    /// @param deadline The deadline timestamp by which the call must be mined for the approve to work.
    /// @param v Must produce valid secp256k1 signature from the holder along with `r` and `s`.
    /// @param r Must produce valid secp256k1 signature from the holder along with `v` and `s`.
    /// @param s Must produce valid secp256k1 signature from the holder along with `r` and `v`.
    function permit(
        address spender,
        uint256 tokenID,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(_exists(tokenID), 'query for nonexistent token');
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp <= deadline, 'permit expired');

        uint256 nonce = _nonces[tokenID]++; // get then increment
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(_PERMIT_TYPEHASH, spender, tokenID, nonce, deadline))
                )
            );
        address owner = ownerOf(tokenID);
        require(spender != owner, 'cannot permit to self');

        if (Address.isContract(owner)) {
            require(IERC1271(owner).isValidSignature(digest, abi.encodePacked(r, s, v)) == 0x1626ba7e, 'unauthorized');
        } else {
            address recoveredAddress = ecrecover(digest, v, r, s);
            require(recoveredAddress != address(0), 'invalid signature');
            require(recoveredAddress == owner, 'unauthorized');
        }

        _approve(spender, tokenID);
    }

    /// @notice Returns the current nonce for `tokenID`. This value must be
    /// included whenever a signature is generated for `permit`.
    /// Every successful call to `permit` increases ``tokenID``'s nonce by one. This
    /// prevents a signature from being used multiple times.
    /// @param tokenID ID of the token to request nonce.
    /// @return nonce Nonce of the token.
    function nonces(uint256 tokenID) external view returns (uint256 nonce) {
        return _nonces[tokenID];
    }

    /// @notice The permit typehash used in the `permit` signature.
    /// @return typehash The typehash for the `permit`.
    // solhint-disable-next-line func-name-mixedcase
    function PERMIT_TYPEHASH() external pure returns (bytes32 typehash) {
        return _PERMIT_TYPEHASH;
    }

    /// @notice The domain separator used in the encoding of the signature for `permit`, as defined by `EIP712`.
    /// @return seperator The domain seperator for `permit`.
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() public view returns (bytes32 seperator) {
        return _domainSeparatorV4();
    }
}
