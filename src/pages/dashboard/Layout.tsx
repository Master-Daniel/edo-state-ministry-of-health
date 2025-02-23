import React from "react";
import SideBar from "../../components/SideBar";

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Layout: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />
            <Outlet />
        </div>
    );
};

export default Layout;
