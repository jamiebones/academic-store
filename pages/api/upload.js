import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import axios from "axios";
const pdf = require("pdf-parse");

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req) => {
  const options = {};
  options.uploadDir = path.join(process.cwd(), "/uploads/pdf");
  options.filename = (name, ext, path, form) => {
    return Date.now().toString() + "_" + path.originalFilename;
  };

  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  try {
    await fs.mkdir(path.join(process.cwd() + "/uploads", "/pdf"), {
      recursive: true,
    });
    const { fields, files } = await readFile(req);
    const filepath = files.file[0].filepath;
    let dataBuffer = await fs.readFile(filepath);
    const pdfData = await pdf(dataBuffer);
    const host = req.headers.origin;
    const response = await axios.post(`${host}/api/checkFileContentWithAI`, {
      pdfString: pdfData.text,
    });

    console.log("response ", response.data);

    const { data, error } = response.data;
    if (error) {
      return res.status(200).json({ data, error });
    }
    data.filepath = filepath;
    return res.status(200).json({ data, error });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
export default handler;
