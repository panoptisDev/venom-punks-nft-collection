import { expect } from "chai";
import * as nt from "nekoton-wasm";
import { Contract, Signer, WalletTypes, Address } from "locklift";
import { FactorySource } from "../build/factorySource";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let signer: Signer;
let ownerKeys: nt.Ed25519KeyPair;

describe("Total supply Function Test :::", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("get total suppply", async function () {
    //get mint price to be greator than 0
    it.skip("can't mint when total supply and minted nfts are equals", async function () {
      console.log("Logging details about giver address------------");

      // Step 2: Get contract Artifacts
      const VenomPunks_Collection_V2_Artifacts = await locklift.factory.getContractArtifacts(
        "VenomPunks_Collection_V2",
      );
      // Step 3: Deploy Collection from Giver account
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
        value: locklift.utils.toNano(15),
      });
      sample = contract;

      ownerKeys = nt.ed25519_generateKeyPair();
      locklift.keystore.addKeyPair(ownerKeys);

      //Get Total Supply
      const totalMaxSupply = await sample.methods.getTotalSupply().call();
      const totalSupplybeforeMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log(totalMaxSupply, "-----------total supply", totalSupplybeforeMint);

      //here i'll bulkmint and check it will not allow minting when totalsupply reaches max

      const account2 = await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.EverWallet, // or WalletTypes.HighLoadWallet or WalletTypes.WalletV3,
        //Value which will send to the new account from a giver
        value: locklift.utils.toNano(30),
        //owner publicKey
        publicKey: ownerKeys.publicKey,
      });

      const txMint = await sample.methods
        .bulkMintNft({
          amount: 6,
        })
        .send({
          //sender account
          from: account2.account.address,
          amount: locklift.utils.toNano(9), // it takes double values
        });
      console.log(txMint, "first bulk mint----------------------");

      //   console.log(txMint);
      // get Total Supply
      const totalSupplyAfterMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      const txMint2 = await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: account2.account.address,
          amount: locklift.utils.toNano(2), // it takes double values
        });
      expect(Number(totalSupplyAfterMint.count + 1)).not.be.above(Number(totalMaxSupply), "total max supply exceeds");
      console.log(totalSupplyAfterMint, "after mint");
    });
    it.skip("total supply changes", async function () {
      console.log("loading total supply------------");

      // Step 2: Get contract Artifacts
      const VenomPunks_Collection_V2_Artifacts = await locklift.factory.getContractArtifacts(
        "VenomPunks_Collection_V2",
      );
      // Step 3: Deploy Collection from Giver account
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
        value: locklift.utils.toNano(15),
      });
      sample = contract;

      const totalMaxSupplybefore = await sample.methods.getTotalSupply().call();
      console.log(totalMaxSupplybefore, "total max supply");

      const setTotalSupplytx = await sample.methods
        .setTotalSupply({
          _newSupply: 10,
        })
        .sendExternal({ publicKey: signer.publicKey });
      const totalMaxSupplyafter = await sample.methods.getTotalSupply().call();
      console.log(totalMaxSupplyafter, "after");
      expect(Number(totalMaxSupplybefore.totalMaxSupply)).not.to.equal(
        Number(totalMaxSupplyafter.totalMaxSupply),
        "price not changed",
      );
    });
  });
});
