const fs = require("fs");
const path = require("path");
import { Address } from "locklift/.";
const addressJson = require("./mintstatus/address.json");

const VenomPunk_CollectionAdd = "0:02511fee850fd1f626d0545ffed97224b63a2346422a5126726074109e070f53";

async function main() {
  try {
    console.log(addressJson);
    const results = { ...addressJson };
    console.log("Reading the metadata for : ");
    const VenomPunk_Collection_Instance = await locklift.factory.getDeployedContract(
      "VenomPunk_Collection",
      new Address(VenomPunk_CollectionAdd),
    );
    // loop
    for (let i = 4499; i < 6000; i++) {
      // get metadata for punk 0
      const nftAddres = await VenomPunk_Collection_Instance.methods
        .nftAddress({ answerId: i.toString(), id: i })
        .call();
      console.log(nftAddres);
      // create Instance for nftaddress contract
      const VenomPunk_Punk_Instance = await locklift.factory.getDeployedContract("VenomPunk_NFT", nftAddres.nft);
      const nftInfo = await VenomPunk_Punk_Instance.methods.getInfo({ answerId: i }).call();
      console.log(nftInfo);
      if (results[nftInfo.owner]) {
        // push
        results[nftInfo.owner].push(i);
      } else {
        results[nftInfo.owner] = [i];
      }

      // update the json in each iteration
      fs.writeFileSync(path.join(__dirname, "mintstatus", "address.json"), JSON.stringify(results), err => {
        console.log("sssssssssss");
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log("Successfully wrote file");
        }
        console.log("ggg");
      });
    }
    return;
    // end of script
    // path.join(__dirname,"mintstatus","address.txt")
    // add to json
    console.log(results);
    fs.writeFileSync(path.join(__dirname, "mintstatus", "address.json"), JSON.stringify(results), err => {
      console.log("sssssssssss");
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
      console.log("ggg");
    });
    console.log("lst");
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
