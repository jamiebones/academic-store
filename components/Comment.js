import React, { useState } from "react";
import axios from "axios";



const CommentBox = ({ transactionID, reloadComment }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const reloadQuery = `query ($tags: [TagFilter!], $order: SortOrder) {
    transactions(tags: $tags, order: $order) {
      edges {
        node {
          timestamp
          address
          tags {
            name
            value
          }
        }
      }
    }
  }`

  const saveComment = async () => {
    if (!name && !comment) {
      alert("name and comment are required");
      return;
    }

    const commentData = {
      name,
      comment,
    };

    const tags = [
      { name: "Content-Type", value: "text/plain" },
      { name: "txID", value: transactionID },
      { name: "name", value: name },
      { name: "comment", value: comment },
      { name: "application-name", value: "arweave-hackathon" },
    ];
    try {
      setProcessing(true);
      const response = await fetch("/api/uploadComment", {
        method: "POST",
        body: JSON.stringify({
          commentData,
          metadata: tags,
        }),
      });

      // The API response
      const tx = await response.json();
      alert(`comment uploaded to : https://arweave.net/${tx}`);
      const responseData = await axios.post("https://node1.bundlr.network/graphql", {
        query: reloadQuery,
        variables: {
          tags: [
            {
              name: "txID",
              values: transactionID,
            },
          ],
          order: "DESC"
        },
      });
      console.log("response ", responseData.data.data.transactions.edges);
      let comments = responseData.data.data.transactions.edges
      reloadComment(comments)
      setProcessing(false);
      setComment("");
      setName("");
    } catch (e) {
      alert("Error : ", e.message);
      console.log("Error saving comment ", e);
      setProcessing(false);
    }
  };
  return (
    <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          name="name"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-gray-700 font-medium mb-1"
        >
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          id="comment"
          name="comment"
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <button
        disabled={processing}
        onClick={saveComment}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {processing ? "submitting comment....." : "submit comment"}
      </button>
    </div>
  );
};

export default CommentBox;
