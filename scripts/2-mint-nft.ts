import { Address, WalletTypes } from "locklift/.";

const VenomPunk_CollectionAdd = "0:02511fee850fd1f626d0545ffed97224b63a2346422a5126726074109e070f53";

async function main() {
  try {
    console.log("Minting an NFT>>>>>>>>>>>>>>>>>>");
    const VenomPunk_Collection_Instance = await locklift.factory.getDeployedContract(
      "VenomPunks_Collection_V2",
      new Address(VenomPunk_CollectionAdd),
    );
    console.log("Checking Minter Balance");
    const userBalance = await locklift.provider.getBalance(
      new Address("0:668ecd2156607f7667640960b6b74692600489ad359178434045aef47a1172af"),
    );
    console.log(userBalance);
    // check the total supply
    const totalSupply = await VenomPunk_Collection_Instance.methods.totalSupply({ answerId: 0 }).call();
    console.log(totalSupply);

    // Get Sender account
    const everWalletAccount = await locklift.factory.accounts.addExistingAccount({
      address: new Address("0:668ecd2156607f7667640960b6b74692600489ad359178434045aef47a1172af"),
      type: WalletTypes.EverWallet,
    });

    // mint a token
    await VenomPunk_Collection_Instance.methods
      .bulkMintNft({
        amount: 1,
      })
      .send({
        //sender account
        from: everWalletAccount.address,
        amount: locklift.utils.toNano(2),
      });

    // check total supply now
    const totalSupplyAfterMint = await VenomPunk_Collection_Instance.methods.totalSupply({ answerId: 0 }).call();
    console.log(totalSupplyAfterMint);

    // check address of the new mint
    const mintAddress = await VenomPunk_Collection_Instance.methods
      .nftAddress({ answerId: 0, id: (0).toString() })
      .call();
    console.log(`Punk#0 minted at: ${mintAddress.nft.toString()}`);
    // end of mint script
    return;
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
