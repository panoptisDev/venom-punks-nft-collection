import { Address } from "locklift/.";

const VenomPunk_CollectionAdd = "0:02511fee850fd1f626d0545ffed97224b63a2346422a5126726074109e070f53";

async function main() {
  try {
    console.log("Checking supports Interface for collection");
    const VenomPunk_Collection_Instance = await locklift.factory.getDeployedContract(
      "VenomPunk_Collection",
      new Address(VenomPunk_CollectionAdd),
    );
    const result = await VenomPunk_Collection_Instance.methods
      .supportsInterface({ answerId: 0, interfaceID: 0x4387BBFB })
      .call();
    console.log(result);
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
