import React from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { Link } from "react-router-dom";
import FormCard from "../../components/FormCard";
import FormHeader from "../../components/FormHeader";

const Create: React.FC = () => {
  return (
    <main className="flex-1 p-4 sm:p-6 max-w-full md:p-6 ">
      <FormHeader />

      <div className="flex justify-center">
        
        <Link to="" className="text-black p-5">Create</Link>
        <Link to="" className="text-black p-5">Preview</Link>
        <Link to="" className="text-black p-5">Responses</Link>
      </div>

      <FormCard />

     
    </main>
  );
};

export default Create;
