import React from 'react'
import { Outlet } from "react-router-dom";
import SideBar from '../../components/SideBar';

const Layout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />
            <Outlet />
        </div>
    )
}

export default Layout