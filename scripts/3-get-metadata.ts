import { Address } from "locklift/.";

const VenomPunk_CollectionAdd = "0:02511fee850fd1f626d0545ffed97224b63a2346422a5126726074109e070f53";

async function main() {
  try {
    console.log("Reading the metadata for : ");
    const VenomPunk_Collection_Instance = await locklift.factory.getDeployedContract(
      "VenomPunk_Collection",
      new Address(VenomPunk_CollectionAdd),
    );
    const totalSupply = await VenomPunk_Collection_Instance.methods.totalSupply({ answerId: 0 }).call();
    console.log(totalSupply);

    // get metadata for punk 0
    const jsonData = await VenomPunk_Collection_Instance.methods.getJson({ answerId: 0 }).call();
    console.log(jsonData);
    // end of script
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
