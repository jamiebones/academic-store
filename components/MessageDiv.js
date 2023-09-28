import React from "react";

const SuccessDiv = ({ message }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mt-20 rounded text-center"
        role="alert"
      >
        <span className="block sm:inline ml-2">{message}</span>
      </div>
    </div>
  );
};

export default SuccessDiv;
