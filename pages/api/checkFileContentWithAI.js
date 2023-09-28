const axios = require("axios");

const keys = [process.env.API_KEY1, process.env.API_KEY2, process.env.API_KEY3];

console.log("keys ", keys);

export default async function handler(req, res) {
  const { pdfString } = req.body;
  const wordsArray = pdfString.trim().split(/\s+/);
  const first2000Words = wordsArray.slice(0, 2200);
  //const last1000Words = wordsArray.slice(-500);
  let extractedpdfString = first2000Words.join(" ");
  console.log("words ", extractedpdfString);
  const prompt = `Your task is to take this string and indetify if the string is from an academic paper \n\n
  you are to analyze the string for the following patterns \\n
  Techncal and formal language \n
  complex ideas and arguments \n
  objective tone \n
  analytical perspective \n
  presence of abstract 
  
  If the document meets 50% of the listed pattern it is an academic document \n
  
  If it is academic extract the field the paper is written on, journal name, title, author, publication date, abstract and keywords in this format;
  
  <p>journal_name: extracted journal name</p>
  <p>title: extrated title </p>;
  <p>author: extracted Author's Name</p>;
  <p>abstract: extracted abstract should contain all the abstract </p>;
  <p>keywords: extracted keywords </p>;
  <p>publication_date: publication date </p>;
  <p>field: extracted field the paper is written on </p>;
 
  use exactly the given format above .If the document is not academic say \n\n
  This is not an academic document. Here comes the string;
  
  ${extractedpdfString}
  `;
  const result = await useGPTchatSimple(prompt);
  const value = filterResultToReturn(result);
  console.log("filtered reult ", value);
  res.status(200).json(value);
}

async function useGPTchatSimple(prompt, temperature = 0.7) {
  let success = false;
  let retries = 0;
  let extraTimeWait = 0;
  let resContent;
  let keyIndex = Math.floor(Math.random() * keys.length);
  let apiKey = keys[keyIndex];
  while (!success && retries < 4) {
    try {
      resContent = await onlyGPTchat(prompt, temperature, apiKey);
      success = true;
    } catch (e) {
      console.log("Error OpenAI = ", e.message);
      // Sleep for a while before trying again
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Switch to the other API key
      keyIndex = Math.floor(Math.random() * keys.length);
      apiKey =
        keys[keyIndex] === apiKey
          ? filterArray(keys, apiKey)[0]
          : keys[keyIndex];
    }
    retries++;

    extraTimeWait += 2000;
  }

  if (!success) {
    console.error("Failed to get response from OpenAI API");
    return "Failed to get a response from OpenAI API";
  }

  // console.log("resContent = ", resContent);

  return resContent;
}

const filterArray = (array, element) => {
  return array.filter((e) => element != e);
};

async function onlyGPTchat(prompt, temperature = 0.7, apiKey) {
  let discussion = [
    {
      role: "user",
      content: prompt,
    },
  ];

  let response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      messages: discussion,
      model: "gpt-3.5-turbo",
      temperature: temperature,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("response.data = ", response.data.choices[0].message.content);

  return response.data.choices[0].message.content;
}

const filterResultToReturn = (resultData) => {
  if (resultData.indexOf("This is not an academic document") != -1) {
    return {
      error: "The pdf document is not an academic data",
      data: null,
    };
  } else if (
    resultData.indexOf("Failed to get a response from OpenAI API") != -1
  ) {
    return {
      data: null,
      error: "Failed to get a response from OpenAI API",
    };
  } else {
    //splitting using <p> and <div> as delimiter
    const splitText = resultData
      .split(/<p>|<\/p>/)
      .filter((item) => item.trim() !== "");
    console.log("split text ", splitText);
    let obj = {
      error: null,
      data: {},
    };
    for (let i = 0; i < splitText.length; i++) {
      const item = splitText[i].split(":");
      obj["data"][item[0]] = item[1];
    }
    return obj;
  }
};
