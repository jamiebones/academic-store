import Bundlr from "@bundlr-network/client";

const { kty, n, e, d, p, q, dp, dq, qi } = process.env;

const ARWEAVE_KEY = { kty, n, e, d, p, q, dp, dq, qi };

const __getBundlrClient = () => {
  const bundlr = new Bundlr(
    "https://node1.bundlr.network",
    "arweave",
    ARWEAVE_KEY
  );
  // Print your wallet address
  console.log(`wallet address = ${bundlr.address}`);
  return bundlr;
};

const uploadFileToArweave = async (commentData, tags) => {
  const bundlr = __getBundlrClient();
  const data = Buffer.from(JSON.stringify(commentData), "utf8");
  const { id } = await bundlr.uploadWithReceipt(data, { tags });
  console.log("file uploaded to ", `https://arweave.net/${id}`);
  return id;
};

export default async function handler(req, res) {
  //metadata is of the type => [{ 'name': key_name, 'value': some_value}]
  try {
    const { commentData, metadata } = JSON.parse(req.body);
    const transId = await uploadFileToArweave(commentData, metadata);
    //
    res.status(200).json(transId);
  } catch (error) {
    console.log("error ", error);
    res.status(400);
  }
}
