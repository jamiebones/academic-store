import React from "react";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const CommentDisplay = ({ comments }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Comments</h2>

        {comments.map((comment, index) => (
          <div
            key={index}
            className={`border-t ${
              index > 0 ? "mt-4" : ""
            } border-gray-300 py-4`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">
                {comment.name}
              </span>
              <span className="text-gray-500 text-sm">
                {comment && dayjs(comment.time).fromNow()}
              </span>
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentDisplay;
