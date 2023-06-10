import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
let acc1: any;
let acc2: any;

describe("remainOnNft Function Test :::", async function () {
  before(async () => {
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10000);
  });
  describe("get remain on nft", async function () {
    it("remainOnNft function setter/getter wokring", async function () {
      console.log("------------------");
      const remain = await sample.methods.getRemainOnNft().call();

      // expect remainonNft must be equals to 300000000
      expect(Number(remain.remainOnNft)).to.equal(300000000, "remainOnNft is not 0.3 ton");

      //Now set remainOnNft to 200000000 and expect it
      await sample.methods
        .setRemainOnNft({
          remainOnNft: locklift.utils.toNano(0.2),
        })
        .sendExternal({ publicKey: acc1.ownerKeys1.publicKey });
      const remainAfterSet = await sample.methods.getRemainOnNft().call();
      expect(Number(remainAfterSet.remainOnNft)).to.equal(200000000, "remainOnNft is not changed");
    });
  });
});
