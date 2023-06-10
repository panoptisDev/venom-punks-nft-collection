import * as nt from "nekoton-wasm";
import { Contract, Signer, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";

export async function deployCollection(locklift: any, signer: any, _maxTotalSupply: number) {
  let sample: Contract<FactorySource["VenomPunks_Collection_V2"]>;
  // get artifacts
  const VenomPunks_Collection_V2_Artifacts = await locklift.factory.getContractArtifacts("VenomPunks_Collection_V2");
  // deploy contract.
  // Step 3: Deploy Collection from Giver account
  const { contract } = await locklift.factory.deployContract({
    contract: "VenomPunks_Collection_V2",
    publicKey: signer.publicKey,
    initParams: {
      _nonce: locklift.utils.getRandomNonce(),
    },
    constructorParams: {
      codeNft: VenomPunks_Collection_V2_Artifacts.code,
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
      ownerPubkey: `0x` + signer.publicKey,
      maxTotalSupply: _maxTotalSupply
    },
    value: locklift.utils.toNano(15),
  });
  sample = contract;
  // return the contract Innstance.
  return sample;
}

export async function initAccounts(locklift: any) {
  // generate a keypair
  const ownerKeys1: nt.Ed25519KeyPair = nt.ed25519_generateKeyPair(); // generates a keypair
  locklift.keystore.addKeyPair(ownerKeys1);
  // add new account with above keys
  const account1 = await locklift.factory.accounts.addNewAccount({
    type: WalletTypes.EverWallet, // or WalletTypes.HighLoadWallet or WalletTypes.WalletV3,
    value: locklift.utils.toNano(50),
    publicKey: ownerKeys1.publicKey,
  });

  // generate account2
  const ownerKeys2: nt.Ed25519KeyPair = nt.ed25519_generateKeyPair(); // generates a keypair
  locklift.keystore.addKeyPair(ownerKeys2);
  // add new account with above keys
  const account2 = await locklift.factory.accounts.addNewAccount({
    type: WalletTypes.EverWallet, // or WalletTypes.HighLoadWallet or WalletTypes.WalletV3,
    value: locklift.utils.toNano(50),
    publicKey: ownerKeys2.publicKey,
  });

  return { 1: { account1, ownerKeys1 }, 2: { account2, ownerKeys2 } };
}
