import { Address, WalletTypes } from "locklift/.";

async function main() {
  try {
    console.log("he-------------");
    const VenomPunks_NFT_V2 = await locklift.factory.getContractArtifacts("VenomPunks_NFT_V2");
    const signer = (await locklift.keystore.getSigner("giver"))!;
    console.log(locklift.keystore);
    console.log(signer);
    const walletV3Account = await locklift.factory.accounts.addExistingAccount({
      address: new Address("0:668ecd2156607f7667640960b6b74692600489ad359178434045aef47a1172af"),
      type: WalletTypes.EverWallet,
    });
    console.log(walletV3Account)
    //
    const storage = locklift.factory.accounts.storage.defaultAccount;
    console.log(storage);
    return;
    // Get the giver Balance
    const userBalance = await locklift.provider.getBalance(
      new Address("0:668ecd2156607f7667640960b6b74692600489ad359178434045aef47a1172af"),
    );
    console.log(userBalance);

    // Deploy the contract
    const { contract: collection, tx } = await locklift.factory.deployContract({
      contract: "VenomPunks_Collection_V2",
      publicKey: signer.publicKey,
      initParams: {},
      constructorParams: {
        codeNft: VenomPunks_NFT_V2.code,
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
        ownerPubkey: `0x` + "1f334284e70639377103b265a0ff63a87d133989abc064882c408392f47f77bf",
      },
      value: locklift.utils.toNano(2),
    });
    console.log(`Collection deployed at: ${collection.address.toString()}`);
    // check balance after wards
    const userBalance_After = await locklift.provider.getBalance(
      new Address("0:668ecd2156607f7667640960b6b74692600489ad359178434045aef47a1172af"),
    );
    console.log(userBalance_After);
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
