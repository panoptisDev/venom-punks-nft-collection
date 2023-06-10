import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
let acc1: any;
let acc2: any;

describe("Suit for Max Supply on soldout", async function () {
  before(async () => {
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10);
  });
  describe("MaxSupploychecks", async function () {
    it("Maxsupplly should be 10000", async function () {
      console.log("------------------");
      const maxTotalSupply = await sample.methods.getMaxSupply().call();
      expect(Number(maxTotalSupply.totalMaxSupply)).to.equal(10, "Price is different");
      // Mint all 10k supply and expect minting to fail at 10k - minting by acc2
      await sample.methods
        .bulkMintNft({
          amount: 10,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(20),
        });
      // expect total Supply to be 10k
      const totalSupplyAtSoldOut = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupplyAtSoldOut.count)).to.equal(9, "Less total");
      // mint another item and it should fail and totalSupply should remain 10
      await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(2),
        });
      const totalSupplyAfter11 = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupplyAfter11.count)).to.equal(9, "MaxSupply check not working");
    });
  });
});
