import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
let acc1: any;
let acc2: any;

describe("setPrice/getPrice Function Test :::", async function () {
  before(async () => {
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10000);
  });
  describe("get Price test Tests", async function () {
    it("mint price should be greater than 0", async function () {
      console.log("------------------");
      const mintPriceObj = await sample.methods.getMintPrice().call();
      expect(Number(mintPriceObj.mintPrice)).to.equal(1000000000, "Price is different");
      // change the price to 2 ton and expect onlyonwner
      await sample.methods
        .setMintPrice({
          _mintPrice: locklift.utils.toNano(2),
        })
        .sendExternal({ publicKey: acc1.ownerKeys1.publicKey });
      // now get price again.
      const mintpriceafter = await sample.methods.getMintPrice().call();
      expect(Number(mintpriceafter.mintPrice)).to.equal(2000000000, "price not changed");
    });
    it("mint should not work when we pass value less than price", async function () {
      await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(1.5),
        });
      const totalSupplyGet = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupplyGet.count)).to.equal(0, "mint is working with less amount");
    });
  });
});
