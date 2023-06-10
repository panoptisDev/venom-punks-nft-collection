import { expect } from "chai";
import { Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let signer: Signer;

describe.skip("Minting Functionality Cases:::", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("giver"))!;
    // console.log(locklift.keystore)
  });
  describe("Minting 1 nft successfully", async function () {
    it.skip("Success: Deploy and Mint", async function () {
      console.log('starting test for ---')
      const VenomPunks_Collection_V2_Artifacts = await locklift.factory.getContractArtifacts("VenomPunks_Collection_V2");

      expect(VenomPunks_Collection_V2_Artifacts.code).not.to.equal(undefined, "Code should be available");
      expect(VenomPunks_Collection_V2_Artifacts.abi).not.to.equal(undefined, "ABI should be available");
      expect(VenomPunks_Collection_V2_Artifacts.tvc).not.to.equal(undefined, "tvc should be available");

      const { contract } = await locklift.factory.deployContract({
        contract: "VenomPunks_Collection_V2",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
          codeNft: VenomPunks_Collection_V2_Artifacts.code,
          json: `{
            "type": "Basic NFT",
            "name": "Venom Punks",
            "description": "Venom Punks, the first-ever NFT project on Venom Foundation, is at the forefront of innovation, setting the benchmark for others to follow. With a limited supply of 10,000, these Punks will live forever on the Venom Foundation Blockchain. Venom Punks aims to become the leading NFT collection on the Venom Foundation. As the first and only project of its kind, Venom Punks will hold a unique position in the ecosystem. Our goal is to make Venom Punks one of the most sought-after collections, offering exciting utilities that will blow your mind! Get ready for an unforgettable experience with Venom Punks!",
            "preview": {
              "source": "https://gold-useless-ape-792.mypinata.cloud/ipfs/QmWFXMCXATPbYaecoH7dxUnZwvnjeVL8XJdLCkTvenTCpg",
              "mimetype": "image/png"
            },
            "files": [
              {
                "source": "https://gold-useless-ape-792.mypinata.cloud/ipfs/QmWFXMCXATPbYaecoH7dxUnZwvnjeVL8XJdLCkTvenTCpg",
                "mimetype": "image/png"
              }
            ],
            "external_url": "https://venompunks.com"
          }
          `,
          ownerPubkey: `0x` + signer.publicKey,
        },
        value: locklift.utils.toNano(2),
      });
      sample = contract;

      expect(await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
    });

    it.skip("Interact with contract", async function () {
      const NEW_STATE = 1;

      await sample.methods.setState({ _state: NEW_STATE }).sendExternal({ publicKey: signer.publicKey });

      const response = await sample.methods.getDetails({}).call();

      expect(Number(response._state)).to.be.equal(NEW_STATE, "Wrong state");
    });
  });
});
