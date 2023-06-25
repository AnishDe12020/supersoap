import { NFTStorage } from "nft.storage";
import config from "config";
import fs from "fs";

const client = new NFTStorage({ token: config.nftStorage });

export const uploadImage = async (file: Express.Multer.File) => {
  const blob = new Blob([fs.readFileSync(file!.path)], {
    type: file?.mimetype,
  });

  fs.unlinkSync(file!.path);

  const cid = await client.storeBlob(blob);

  const imageUri = `https://ipfs.io/ipfs/${cid}`;
};
