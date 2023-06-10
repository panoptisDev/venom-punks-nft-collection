import { expect } from "chai";
import { Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { deployCollection, initAccounts } from "./helper";

let sample: Contract<FactorySource["VenomPunks_Collection"]>;
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
    it("contract balance increases", async function () {
      console.log("------------------");
      //Get Contract balance
      const contractBalance = await locklift.provider.getBalance(sample.address);
      console.log(contractBalance);
      //Mint one nft and check contract balance
      await sample.methods
        .bulkMintNft({
          amount: 1,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(1.4),
        });
      // check suppply to asset minting
      const totalSupploy = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log(totalSupploy);
      expect(Number(totalSupploy.count)).to.equal(1, "Price is different");
      const contractBalanceafterMint = await locklift.provider.getBalance(sample.address);
      console.log(contractBalanceafterMint);
      //Now Expect the result
      // expect the new balance to be mint + original Balance.
      expect(Number(contractBalanceafterMint)).to.be.above(
        Number(contractBalance) + Number(locklift.utils.toNano(0.9)),
        "mint value is not despositing in contract",
      );
    });
    it("Mint again with two items", async function () {
      console.log("------------------");
      //Get Contract balance
      const contractBalance = await locklift.provider.getBalance(sample.address);
      console.log(contractBalance);
      //Mint one nft and check contract balance
      await sample.methods
        .bulkMintNft({
          amount: 2,
        })
        .send({
          //sender account
          from: acc2.account2.account.address,
          amount: locklift.utils.toNano(2.8),
        });
      // check suppply to asset minting
      const totalSupploy = await sample.methods.totalSupply({ answerId: 0 }).call();
      console.log(totalSupploy);
      expect(Number(totalSupploy.count)).to.equal(3, "Price is different");
      const contractBalanceafterMint = await locklift.provider.getBalance(sample.address);
      console.log(contractBalanceafterMint);
      //Now Expect the result
      // expect the new balance to be mint + original Balance.
      expect(Number(contractBalanceafterMint)).to.be.above(
        Number(contractBalance) + Number(locklift.utils.toNano(1.8)),
        "mint value is not despositing in contract",
      );
    });
    it("Check  withdraw functionality", async function () {
      console.log("------------------");
      // get balance of acc3;
      const acc2BalanceBefore = await locklift.provider.getBalance(acc2.account2.account.address);
      console.log(acc2BalanceBefore);
      //Get Contract balance
      const contractBalance = await locklift.provider.getBalance(sample.address);
      console.log(contractBalance);
      // console.log(acc2.account2.account.address);
      // await locklift.tracing.trace(
      //   sample.methods
      //     .withdraw({ dest: acc2.account2.account.address, value: locklift.utils.toNano(5) })
      //     .sendExternal({ publicKey: acc1.ownerKeys1.publicKey }),
      // );
      await sample.methods
        .withdraw({ dest: acc2.account2.account.address, value: locklift.utils.toNano(10) })
        .sendExternal({ publicKey: acc1.ownerKeys1.publicKey });
      //
      const contractBalanceafterWith = await locklift.provider.getBalance(sample.address);
      console.log(contractBalanceafterWith);
      //Now Expect the result
      // get balance of acc3;
      const acc2BalanceAfter = await locklift.provider.getBalance(acc2.account2.account.address);
      console.log(acc2BalanceAfter);

      expect(Number(acc2BalanceAfter)).to.be.above(
        Number(acc2BalanceBefore) + Number(locklift.utils.toNano(9.5)),
        "Credit failed",
      );
    });
    it("Unauthorized withdrawl should fail", async function () {
      console.log("------------------");
      // get balance of acc3;
      const acc2BalanceBefore = await locklift.provider.getBalance(acc2.account2.account.address);
      console.log(acc2BalanceBefore);
      //Get Contract balance
      const contractBalance = await locklift.provider.getBalance(sample.address);
      console.log(contractBalance);
      // console.log(acc2.account2.account.address);
      // await locklift.tracing.trace(
      //   sample.methods
      //     .withdraw({ dest: acc2.account2.account.address, value: locklift.utils.toNano(5) })
      //     .sendExternal({ publicKey: acc1.ownerKeys1.publicKey }),
      // );
      await sample.methods
        .withdraw({ dest: acc2.account2.account.address, value: locklift.utils.toNano(10) })
        .sendExternal({ publicKey: acc2.ownerKeys2.publicKey });
      //
      const contractBalanceafterWith = await locklift.provider.getBalance(sample.address);
      console.log(contractBalanceafterWith);
      //Now Expect the result
      // get balance of acc3;
      const acc2BalanceAfter = await locklift.provider.getBalance(acc2.account2.account.address);
      console.log(acc2BalanceAfter);

      expect(Number(acc2BalanceAfter)).to.equal(Number(acc2BalanceBefore), "Unauthorize credit occured");
    });
  });
});
