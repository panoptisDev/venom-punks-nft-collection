import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
let acc1: any;
let acc2: any;

describe("Max Mint per Account Function Test :::", async function () {
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
    it("max mint per Account test", async function () {
      console.log("------------------Max Mint per account---------------");
      // get the minterCount
      // mint from acc1
      await sample.methods
      .bulkMintNft({
        amount: 1,
      })
      .send({
        //sender account
        from: acc1.account1.account.address,
        amount: locklift.utils.toNano(2),
      });
      console.log('minters status of acc1')
      console.log(await sample.methods.getMinterStatus({ minterAdd: acc1.account1.account.address }).call());

      const mintCount = await sample.methods.getMinterStatus({ minterAdd: acc2.account2.account.address }).call();
      console.log(mintCount);
      await sample.methods
        .bulkMintNft({
          amount: 10,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(20),
        });
      const totalSupplyAfterMint = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupplyAfterMint.count)).to.equal(11, "Less total");
      const mintCounta = await sample.methods.getMinterStatus({ minterAdd: acc2.account2.account.address }).call();
      console.log(mintCounta);
      // try minting 7 items agains. it should not mint
      await sample.methods
        .bulkMintNft({
          amount: 7,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(14),
        });
      const supplyaFTERsECONDMINT = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log(supplyaFTERsECONDMINT);
      expect(Number(supplyaFTERsECONDMINT.count)).to.equal(11, "Less total");
    });
  });
});
