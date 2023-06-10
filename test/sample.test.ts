import { expect } from "chai";
import * as nt from "nekoton-wasm";
import { Contract, Signer, WalletTypes, Address } from "locklift";
import { FactorySource } from "../build/factorySource";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let signer: Signer;
let ownerKeys: nt.Ed25519KeyPair;

describe.skip("withdraw Function Test :::", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe.skip("WSample", async function () {
    it.skip("dddddddddddddddddd", async function () {
      console.log("Logging details about giver address------------");
      // get givers Balance.
      const giverBalanceBefpre = await locklift.provider.getBalance(
        new Address("0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415"),
      );
      console.log(giverBalanceBefpre);
      // Step 1: create another account and see if we automatically get funds
      ownerKeys = nt.ed25519_generateKeyPair();
      locklift.keystore.addKeyPair(ownerKeys);
      //
      console.log("Creating new keys for adding another account");
      console.log(ownerKeys);
      console.log("-------------");
      const account2 = await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.EverWallet, // or WalletTypes.HighLoadWallet or WalletTypes.WalletV3,
        //Value which will send to the new account from a giver
        value: locklift.utils.toNano(20),
        //owner publicKey
        publicKey: ownerKeys.publicKey,
      });
      // get the public key of new account
      console.log(account2.account);
      // get baalance for account2
      const account2Bal = await locklift.provider.getBalance(account2.account.address);
      console.log("---------balance of new account----------------");
      console.log(account2Bal);

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
          ownerPubkey: `0x` + ownerKeys.publicKey,
        },
        value: locklift.utils.toNano(15),
      });
      sample = contract;
      // Step 5: get publickey of owner of contract
      const ownerpubkeyy = await sample.methods.owner({ answerId: "0" }).call();
      console.log("---------Onwer off contract all result");
      console.log(ownerpubkeyy);
      //   const acc2BalBeforeWith = await locklift.provider.getBalance(account2.account.address);
      //   console.log("Prev balance of new account");
      //   console.log(acc2BalBeforeWith);
      // send out some eth. TODO: SEND ONE TRANSACTION WITH ACCOUNT2 SO THAT ITS STATE BECOMES AVAILABLE IN THE BLOKCHAIN.
      const contractBalanceBeforeMint = await locklift.provider.getBalance(sample.address);
      console.log("--------Contract balance before Mint");
      console.log(contractBalanceBeforeMint);
      //
      const totalSupplyBeforeMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log("total supply before Mint");
      console.log(totalSupplyBeforeMint);
      // mint an NFT with account2
      const txMint = await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: account2.account.address,
          amount: locklift.utils.toNano(2),
        });
      //   console.log(txMint);
      // get Total Supply
      const totalSupplyAfterMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log("---------------------Total supploy after mint success------------");
      console.log(totalSupplyAfterMint);
      // Fetch Contracts balance before widthdra
      const contractBalanceBeforeWEith = await locklift.provider.getBalance(sample.address);
      console.log("--------Contract balance before Withdraw___________");
      console.log(contractBalanceBeforeWEith);

      const acc2Balance_after_mint = await locklift.provider.getBalance(account2.account.address);
      console.log("---------Account 2 balance after mint----------------");
      console.log(acc2Balance_after_mint);

      await locklift.tracing.trace(
        sample.methods
          .withdraw({ dest: account2.account.address, value: locklift.utils.toNano(5) })
          .sendExternal({ publicKey: ownerKeys.publicKey }),
      );
      // withdraw
      console.log("***************** Strting withddraw**************");
      const tx = await sample.methods
        .withdraw({ dest: account2.account.address, value: locklift.utils.toNano(5) })
        .send({ from: account2.account.address, amount: locklift.utils.toNano(0) });
      console.log(tx);
      // contract balanace after widthdarawl
      const contractBalanceAfterWEith = await locklift.provider.getBalance(sample.address);
      console.log("--------Contract balance after withdreaw");
      console.log(contractBalanceAfterWEith);
      // check balance for account
      const account2BalAfterWidth = await locklift.provider.getBalance(account2.account.address);
      console.log("New balance of new account");
      console.log(account2BalAfterWidth);
    });
  });
});
