import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let acc1: any;
let acc2: any;

describe("Contract Balance must be changed when someone minted ", async function () {
  before(async () => {
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10000);
  });
  describe("Contract Balance after mint", async function () {
    it.skip("contract balance increases", async function () {
      console.log("------------------");
      //Get Contract balance
      const contractBalance = await locklift.provider.getBalance(sample.address);
      //Mint one nft and check contract balance
      await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(2),
        });
      const contractBalanceafterMint = await locklift.provider.getBalance(sample.address);
      //Now Expect the result
      expect(Number(contractBalanceafterMint)).to.be.above(
        Number(contractBalance),
        "mint value is not despositing in contract",
      );
    });
  });
});
