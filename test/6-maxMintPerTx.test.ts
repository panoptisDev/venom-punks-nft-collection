import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
let acc1: any;
let acc2: any;

describe("Max Mint per transaction Function Test :::", async function () {
  before(async () => {
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10000);
  });
  describe("check if mint works if amount is greater than 10", async function () {
    it("max mint per transaction test", async function () {
      console.log("------------------Max Mint ---------------");
      await sample.methods
        .bulkMintNft({
          amount: 11,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(22),
        });
      const totalSupplyAfterMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupplyAfterMint.count)).to.equal(0, "Less total");
    });
  });
});
