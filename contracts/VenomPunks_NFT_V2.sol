pragma ton-solidity =0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "@itgold/everscale-tip/contracts/TIP4_1/TIP4_1Nft.sol";
import "@itgold/everscale-tip/contracts/TIP4_2/TIP4_2Nft.sol";
// import "./interfaces/ITokenBurned.sol";

contract VenomPunks_NFT_V2 is TIP4_1Nft, TIP4_2Nft {
  constructor(
    address owner,
    address sendGasTo,
    uint128 remainOnNft,
    string json
  ) public TIP4_1Nft(owner, sendGasTo, remainOnNft) TIP4_2Nft(json) {
    tvm.accept();
  }

//   function burn(address dest) external virtual onlyManager {
//     tvm.accept();
//     ITokenBurned(_collection).onTokenBurned(_id, _owner, _manager);
//     selfdestruct(dest);
//   }
}
