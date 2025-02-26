import React from "react";
import { FiType } from "react-icons/fi";

const ShortAnswerInput: React.FC = () => {
  return (
    <div className="mt-3 flex items-center">
      <FiType className="mr-2 text-gray-600" />
      <input
        type="text"
        placeholder="Please input your answer"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-600 focus:outline-none fancy-input"
        disabled
      />
    </div>
  );
};

export default ShortAnswerInput;
