import { expect } from "chai";
import { Contract, Signer, WalletTypes, Address } from "locklift";
import { FactorySource } from "../build/factorySource";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let signer: Signer;

describe.skip("withdraw Function Test :::", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    // console.log(signer);
  });
  describe("Withdraw method Success", async function () {
    it.skip("Successfully deployed and withdraw", async function () {
      console.log("starting test for ---");
      const VenomPunks_Collection_V2_Artifacts = await locklift.factory.getContractArtifacts(
        "VenomPunks_Collection_V2",
      );

      expect(VenomPunks_Collection_V2_Artifacts.code).not.to.equal(undefined, "Code should be available");
      expect(VenomPunks_Collection_V2_Artifacts.abi).not.to.equal(undefined, "ABI should be available");
      expect(VenomPunks_Collection_V2_Artifacts.tvc).not.to.equal(undefined, "tvc should be available");
      const giverBalanceBefpre = await locklift.provider.getBalance(
        new Address("0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415"),
      );
      console.log(giverBalanceBefpre);

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
      return;
      const contractBalance = await locklift.provider.getBalance(sample.address);
      console.log(contractBalance, "contract balance");
      expect(Number(contractBalance)).to.be.above(0, "contract balance less than 2");
      console.log("Triggering withdraw amount");

      const giveradd_ = await locklift.keystore.getSigner("giver");
      console.log(giveradd_);
      // get address of the wallet smart contract
      const walletV3Account = await locklift.factory.accounts.addExistingAccount({
        address: new Address("0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415"),
        type: WalletTypes.EverWallet,
      });
      //
      console.log(walletV3Account.address);
      const giverBalance = await locklift.provider.getBalance(walletV3Account.address);
      console.log(giverBalance);
      // await sample.methods.withdraw({ dest:   }).sendExternal({ publicKey: signer.publicKey });
      // get address  for signer 0
      const signerZero = (await locklift.keystore.getSigner("0"))!;
      const aaa = await locklift.factory.accounts.addExistingAccount({
        publicKey: signerZero.publicKey,
        type: WalletTypes.WalletV3,
      });
      //
      await locklift.giver.sendTo(aaa.address, "10");
      // check balance for signer0
      const aBal = await locklift.provider.getBalance(aaa.address);
      console.log(aBal);
      //
      // for(let i=0;i<20 ; i++) {
      //   const giveradd_ = await locklift.keystore.getSigner(`${i}`);
      //   console.log(giveradd_);
      //   // get address of the wallet smart contract
      //   const walletV3Account = await locklift.factory.accounts.addExistingAccount({
      //     publicKey: giveradd_.publicKey,
      //     type: WalletTypes.WalletV3,
      //   });
      //   const giverBalance = await locklift.provider.getBalance(walletV3Account.address);
      //   console.log(giverBalance)
      // }
    });
  });
});
