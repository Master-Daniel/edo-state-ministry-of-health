import React, { useState } from "react";
import circle from "../../public/assets/icons/circle.svg";
import x from "../../public/assets/icons/x.svg";

const DropdownInput: React.FC<{ showPoints?: boolean }> = () => {
  const [options, setOptions] = useState([""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <div className="mt-3">
      {options.map((_, index) => (
        <div className="row mt-2" key={index}>
          <div className="col-md-8">
            <div className="flex items-center">
              <div className="mr-2 text-black font-bold">{index + 1}. </div>

              <input
                type="text"
                className="w-full fancy-input rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-600 focus:outline-none"
                placeholder={`Option ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="ml-2 text-red-500"
              >
                <img src={x} alt="x icon" className="ml-2" />
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="">Points</label> <br />
            <input
              type="number"
              className="point-input rounded-md border border-gray-300 text-gray-900 focus:border-green-600 focus:outline-none appearance-none"
              placeholder=""
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddOption} className="mt-3">
        <div className="flex items-center">
          <div className="mr-3 text-black font-bold">{options.length + 1}</div>
          <span className="text-blue-500">Add Option</span>
        </div>
      </button>
    </div>
  );
};

export default DropdownInput;
