import fileReaderStream from "filereader-stream";
import getBundlr from "../utils/getBundlr";

const fundAndUpload = async (selectedFile, tags) => {
  try {
    const bundlr = await getBundlr();
    const dataStream = fileReaderStream(selectedFile);
    const price = await bundlr.getPrice(selectedFile?.size);
    const balance = await bundlr.getLoadedBalance();

    if (price.isGreaterThanOrEqualTo(balance)) {
      console.log("Funding node.");
      await bundlr.fund(price);
    } else {
      console.log("Funding not needed, balance sufficient.");
    }

    const tx = await bundlr.upload(dataStream, {
      tags,
    });
    return tx.id;
  } catch (e) {
    console.log("Error on upload, ", e.message);
  }
};

export default fundAndUpload;
