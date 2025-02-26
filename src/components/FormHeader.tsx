import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setSideBarOpen } from "../redux/slices/globalSlice";
import { deleteCookie, onSuccessResponse } from "../utils/custom-functions";

const FormHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("edo-state-token");
    dispatch(setSideBarOpen(false));
    dispatch(setIsLoggedIn(false));
    onSuccessResponse("Logged Out Successfully");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center rounded-md bg-white p-4 shadow-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-between">
            <Link to="/dashboard">

          <div className="flex items-center space-x-2">
            <img src="/assets/images/logo.png" alt="Logo" className="w-12" />
            <h6
              className="text-green-900 font-semibold"
              style={{ color: "#093D20" }}
            >
              Edo State <br /> Ministry of Health
            </h6>
          </div>
          </Link>
        </div>
      </div>

      <h4 className="font-semibold text-black">
        {/* Division of Regulation and Monitoring */}
      </h4>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="hidden sm:flex space-x-4 items-center">
          <Link
            to="#"
            className="bg-green-900 text-white px-4 py-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
