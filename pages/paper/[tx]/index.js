import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  GetDocumentByTransactionID,
  GetPaperComments,
} from "../../../graphql/queries";
import { useEffect, useState } from "react";
import CommentBox from "../../../components/Comment";
import CommentDisplay from "@/components/CommentDisplay";
import Head from "next/head";

const PaperDetailsPage = ({ paper, error, paperId, comments }) => {
  <Head>
    <title>Paper Details</title>
    <meta name="description" content="Paper details" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
  </Head>;

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [author, setAuthor] = useState("");
  const [keywords, setKeywords] = useState("");
  const [field, setField] = useState("");
  const [publishIn, setPublishIn] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [address, setAddress] = useState("");
  const [paperComments, setPaperComments] = useState(null);

  const reloadComment = (comments) => {
    let commentsArray = [];
    if (comments) {
      comments.map(({ node: { tags, timestamp } }) => {
        const obj = {};
        obj.time = timestamp;
        console.log("comment nodes ", tags, timestamp);
        tags.map(({ name, value }) => {
          if (name == "name") {
            obj.name = value;
          } else if (name == "comment") {
            obj.content = value;
          }
        });
        commentsArray.push(obj);
      });
      setPaperComments(commentsArray);
    }
  };

  useEffect(() => {
    let commentsArray = [];
    if (comments) {
      comments.map(({ node: { tags, timestamp } }) => {
        const obj = {};
        obj.time = timestamp;
        console.log("comment nodes ", tags, timestamp);
        tags.map(({ name, value }) => {
          if (name == "name") {
            obj.name = value;
          } else if (name == "comment") {
            obj.content = value;
          }
        });
        commentsArray.push(obj);
      });
      setPaperComments(commentsArray);
    }
    if (paper) {
      console.log("comments : ", comments);
      setTimestamp(paper.timestamp);
      setAddress(paper.address);
      paper.tags.map(({ name, value }) => {
        switch (name) {
          case "title":
            setTitle(value);
            break;
          case "abstract":
            setAbstract(value);
            break;
          case "publishIn":
            setPublishIn(value);
            break;
          case "author":
            setAuthor(value);
            break;
          case "field":
            setField(value);
            break;
          case "keywords":
            setKeywords(value);
            break;
        }
      });
    }
  }, []);

  return (
    <div className="flex justify-center item-center mt-16">
      <div className="w-1/2">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Paper Details</h2>
          <ul className="list-none pl-6 pl-6">
            <li>Date uploaded: {timestamp}</li>
            <li>Uploader Address: {address}</li>
            <li>Paper Title: {title}</li>
            <li>Author: {author}</li>
            <li>Field: {field}</li>
            <li>Publish In: {publishIn && publishIn.toUpperCase()}</li>
          </ul>
          <h3 className="text-lg font-bold mt-4">Abstract</h3>
          <p className="p-2 text-gray-800 font-medium bg-white rounded-lg">
            {abstract}
          </p>
          <h3 className="text-lg font-bold mt-4">Keywords</h3>
          <p className="p-2 text-white font-bold bg-gray-500 rounded-lg ">
            {keywords}
          </p>

          <div className="mt-4 text-center">
            <a
              href={`https://arweave.net/${paperId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="bg-green-500 hover:bg-green-700 
          text-white font-bold py-2 px-4 rounded"
              >
                Download Paper
              </button>
            </a>
          </div>
        </div>

        {paperComments && <CommentDisplay comments={paperComments} />}

        {paperId && (
          <CommentBox transactionID={paperId} reloadComment={reloadComment} />
        )}
      </div>
    </div>
  );
};

export default PaperDetailsPage;

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  uri: "https://node1.bundlr.network/graphql/",
  cache: new InMemoryCache(),
});

export const getServerSideProps = async (context) => {
  const { tx } = context.query;
  try {
    const [paper, comments] = await Promise.all([
      client.query({
        query: GetDocumentByTransactionID,
        variables: {
          ids: tx,
          ssr: true,
        },
      }),

      client.query({
        query: GetPaperComments,
        variables: {
          tags: [
            {
              name: "txID",
              values: tx,
            },
          ],
          order: "DESC",
          ssr: true,
        },
      }),
    ]);

    console.log("comments data ", comments && comments.data.transactions);

    return {
      props: {
        paper: paper && paper.data.transactions.edges[0].node,
        comments: comments && comments.data.transactions.edges,
        paperId: tx,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        paper: null,
        paperId: null,
        comments: null,
        error: "Paper not found",
      },
    };
  }
};
