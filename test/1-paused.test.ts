import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
let acc1: any;
let acc2: any;

describe("Paused/Unpaused Function Test :::", async function () {
  before(async () => {
    // signer = (await locklift.keystore.getSigner("0"))!;
    // create some test accounts
    const accounts = await initAccounts(locklift);
    acc1 = accounts[1];
    acc2 = accounts[2];
    // get signer for
    // Deploy Collection from acc1;
    sample = await deployCollection(locklift, acc1.ownerKeys1, 10000);
  });
  describe("Paused Tests", async function () {
    it.skip("by default paused should be false", async function () {
      console.log("---------------------------------");
      //Step 2: Fetch paused and expect to be false
      const pausedStatus_ = await sample.methods.getPaused().call();
      console.log(pausedStatus_, "paused------------------");
      expect(pausedStatus_.pausedStatus).to.equal(false, "contract by default is false");
      // get Total Supply
    });
    //
    it.skip("Set Paused to true and expect mint to fail or no increase in totalSupply", async function () {
      // set pauased to true - only owner call
      await sample.methods
        .setPaused({
          _state: true,
        })
        .sendExternal({ publicKey: acc1.ownerKeys1.publicKey });
      // expect paused to be true
      const pausedStatus_after = await sample.methods.getPaused().call();
      expect(pausedStatus_after.pausedStatus).to.equal(true, "Contract is not paused");
      // try to mint and check for totalsupply not increasing. --- mint by acc2;
      await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(2),
        });
      console.log("after mint");
      // expect total supply to be zeero
      const totalSupply_ = await sample.methods.totalSupply({ answerId: 0 }).call();
      expect(Number(totalSupply_.count)).to.equal(0, "Paused in not working");
    });
  });
});
