// run with `node --loader ts-node/esm ./scripts/getPrivateKey.ts`

import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"
import * as dotenv from "dotenv"

dotenv.config()

const privateKey = process.env.KEYPAIR
const keypair: Keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(privateKey as string))
)

console.log("publicKey", keypair.publicKey)
// console.log(new TextDecoder().decode(keypair.secretKey));
const key = bs58.encode(keypair.secretKey)
console.log("privateKey", key)
