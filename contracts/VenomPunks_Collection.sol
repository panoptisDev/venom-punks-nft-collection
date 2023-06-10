pragma ton-solidity =0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "@itgold/everscale-tip/contracts/TIP4_1/TIP4_1Collection.sol";
import "@itgold/everscale-tip/contracts/TIP4_2/TIP4_2Collection.sol";
import "@itgold/everscale-tip/contracts/access/OwnableExternal.sol";
import "./VenomPunks_NFT.sol";
import "./interfaces/ITokenBurned.sol";

library CustomCollectionErrors {
  uint16 constant value_is_less_than_required = 103;
  uint16 constant sender_is_not_collection = 104;
  uint16 constant amount_is_zero = 105;
  uint16 constant supply_run_out = 106;
  uint16 constant max_mint_per_tx_exceeded = 107;
}

contract VenomPunks_Collection is TIP4_1Collection, TIP4_2Collection, OwnableExternal, ITokenBurned {
  /// JSON_TEMPLATE - json schema for an nft contract, modified during minting
  string JSON_TEMPLATE =
    '{\r\n  "type": "Basic NFT",\r\n  "name": "Venom Punks",\r\n  "description": "Venom Punks, the first-ever NFT project on Venom Foundation, is at the forefront of innovation, setting the benchmark for others to follow. With a limited supply of 10,000, these Punks will live forever on the Venom Foundation Blockchain. Venom Punks aims to become the leading NFT collection on the Venom Foundation. As the first and only project of its kind, Venom Punks will hold a unique position in the ecosystem. Our goal is to make Venom Punks one of the most sought-after collections, offering exciting utilities that will blow your mind! Get ready for an unforgettable experience with Venom Punks!",\r\n  "preview": {\r\n    "source": "https://gold-useless-ape-792.mypinata.cloud/ipfs/QmWFXMCXATPbYaecoH7dxUnZwvnjeVL8XJdLCkTvenTCpg",\r\n    "mimetype": "image/png"\r\n  },\r\n  "files": [\r\n    {\r\n      "source": "https://gold-useless-ape-792.mypinata.cloud/ipfs/QmWFXMCXATPbYaecoH7dxUnZwvnjeVL8XJdLCkTvenTCpg",\r\n      "mimetype": "image/png"\r\n    }\r\n  ],\r\n  "external_url": "https://venompunks.com"\r\n}\r\n';

  /// _remainOnNft - the number of crystals that will remain after the entire mint
  /// process is completed on the Nft contract
  uint128 _remainOnNft = 0.3 ton;
  uint128 _mintNftValue = _remainOnNft + 0.1 ton;
  uint128 _processingValue = 1 ton; // Mint Price
  uint128 _maxTotalSupply; // 10k supply //todo: change to 10000
  bool paused = false;

  // max 10 allowed per wallet
  mapping(address => uint256) minters; // map of address to number of items minted.

  constructor(
    TvmCell codeNft,
    uint256 ownerPubkey,
    string json,
    uint128 maxTotalSupply
  ) public OwnableExternal(ownerPubkey) TIP4_1Collection(codeNft) TIP4_2Collection(json) {
    tvm.accept();
    _maxTotalSupply = maxTotalSupply;
  }

  function bulkMintNft(uint32 amount) external view virtual {
    require(!paused); // Should not be paused
    require(amount > 0, CustomCollectionErrors.amount_is_zero);
    require(amount <= 10, CustomCollectionErrors.max_mint_per_tx_exceeded);
    require(
      msg.value >= (_mintNftValue + _processingValue) * amount,
      CustomCollectionErrors.value_is_less_than_required
    );
    // check if we run out of supply
    require(amount + _totalSupply <= _maxTotalSupply, CustomCollectionErrors.supply_run_out);
    // check if wallet exceeds max mint amount of 10;
    require(minters[msg.sender] <= 10); // TODO: the max per wallet should be configureable
    /// reserve original_balance + _mintingFee
    tvm.rawReserve((_processingValue * amount), 4); // First of all reserve the mint price. so that values are locked
    // tvm.rawReserve(0, 4); // reserve only Original Balance. kkep balance of contract in place. and pass the value down.
    _invokeMint(msg.sender, amount, 0);
  }

  function _invokeMint(address owner, uint32 amount, uint32 currentIteration) internal pure virtual {
    if (currentIteration < amount) {
      VenomPunks_Collection(address(this)).mintNft{ value: 0, flag: 128 }(owner, amount, currentIteration);
    } else {
      // owner.transfer({ value: 0, flag: 128, bounce: false });
    }
  }

  // This shoule be internal because we don't have price check in it.
  function mintNft(address owner, uint32 amount, uint32 currentIteration) external virtual {
    require(!paused); // should not be paused
    require(msg.sender == address(this), CustomCollectionErrors.sender_is_not_collection);
    // check if we run out of supply
    require(_totalSupply + 1 < _maxTotalSupply, CustomCollectionErrors.supply_run_out);
    // Reserve.
    // tvm.rawReserve(0, 4);
    uint256 id = uint256(_totalSupply);
    _totalSupply++;

    TvmCell codeNft = _buildNftCode(address(this));
    TvmCell stateNft = _buildNftState(codeNft, id);
    address nftAddr = new VenomPunks_NFT{ stateInit: stateNft, value: _mintNftValue, flag: 0 }(
      owner,
      owner,
      _remainOnNft,
      getNftJson()
    );

    emit NftCreated(id, nftAddr, owner, owner, owner);

    currentIteration++;
    // increase the mints per waller for the sender
    minters[msg.sender] = minters[msg.sender] + 1;

    _invokeMint(owner, amount, currentIteration);
  }

  function getNftJson() public view returns (string json) {
    json = JSON_TEMPLATE;
  }

  function setNotRevealedJson(string _NEW_JSON_TEMPLATE) external virtual onlyOwner {
    JSON_TEMPLATE = _NEW_JSON_TEMPLATE;
  }

  function setRemainOnNft(uint128 remainOnNft) external virtual onlyOwner {
    _remainOnNft = remainOnNft;
  }

  function getRemainOnNft() public view returns (uint128 remainOnNft) {
    remainOnNft = _remainOnNft;
  }

  /**
   ** Setter function for NFT price.
   */
  function setMintPrice(uint128 _mintPrice) external virtual onlyOwner {
    _processingValue = _mintPrice;
  }

  function getMintPrice() public view returns (uint128 mintPrice) {
    mintPrice = _processingValue;
  }

  /**
   ** Setter function for pausing and unpausing.
   */
  function setPaused(bool _state) external virtual onlyOwner {
    paused = _state;
  }

  function getPaused() public view returns (bool pausedStatus) {
    pausedStatus = paused;
  }

  function getMaxSupply() public view returns (uint128 totalMaxSupply) {
    totalMaxSupply = _maxTotalSupply;
  }

  function withdraw(address dest, uint128 value) external onlyOwner {
    tvm.accept();
    dest.transfer(value, true);
  }

  // Token burn handler
  function onTokenBurned(uint256 id, address owner, address manager) external override {
    require(msg.sender == _resolveNft(id));
    emit NftBurned(id, msg.sender, owner, manager);
    _totalSupply--;
  }

  function _buildNftState(
    TvmCell code,
    uint256 id
  ) internal pure virtual override(TIP4_1Collection, TIP4_2Collection) returns (TvmCell) {
    return tvm.buildStateInit({ contr: VenomPunks_NFT, varInit: { _id: id }, code: code });
  }
}
