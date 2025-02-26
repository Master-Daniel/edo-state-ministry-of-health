import React from "react";
import SideBar from "../../components/SideBar";

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const FormLayout: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="h-screen bg-gray-100">
            <Outlet />
        </div>
    );
};

export default FormLayout;
