import React, { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { onSuccessResponse } from "../../utils/custom-functions";

const ViewSubmissions: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyLink = (formId: number) => {
    const formLink = `${window.location.origin}/form/passcode?${formId}`;
    navigator.clipboard.writeText(formLink)
      .then(() => {
        setCopiedIndex(formId);
        onSuccessResponse("Form link copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000); // Reset color after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <main className="flex-1 p-6 sm:ml-0 lg:ml-64">
      <DashboardHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <div className="border-gray-300 rounded-md w-full">
              <img
                src="/assets/images/dept.png"
                alt="Logo"
                className="w-full h-auto"
              />
            </div>
            <h4 className="text-green-900 font-semibold text-center mt-2">
              Department Of Nursing
            </h4>
            <button
              type="button"
              className={`border text-black rounded-3 border-black p-2 w-full mt-2 transition ${
                copiedIndex === index ? "bg-green-800 border-green-600" : "text-black hover:bg-gray-100"
              }`}
              onClick={() => handleCopyLink(index)}
            >
              {copiedIndex === index ? "Copied!" : "Share Form"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ViewSubmissions;
