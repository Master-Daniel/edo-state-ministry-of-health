import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import {
    GridViewOutlined as DashboardIcon,
    FormatListBulletedOutlined as EvaluationsIcon,
    ImportContactsOutlined as SubmissionsIcon,
    MenuBookOutlined as PasscodesIcon,
    PersonOutlineOutlined as ProfileIcon,
    SettingsOutlined as SettingsIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsLoggedIn, setSideBarOpen } from "../redux/slices/globalSlice";
import { deleteCookie, onSuccessResponse } from "../utils/custom-functions";

const menuItems = [
    { path: "/dashboard", label: "Dashboard Overview", icon: <DashboardIcon /> },
    { path: "/dashboard/manage-evaluations", label: "Manage Evaluations", icon: <EvaluationsIcon /> },
    { path: "/dashboard/view-submissions", label: "View Submissions", icon: <SubmissionsIcon /> },
    { path: "/dashboard/manage-passcodes", label: "Manage PassCodes", icon: <PasscodesIcon /> },
    { path: "/dashboard/profile", label: "Profile", icon: <ProfileIcon /> },
    { path: "/dashboard/settings", label: "Settings", icon: <SettingsIcon /> }
];

const SideBar: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isSideBarOpen } = useSelector((state: RootState) => state.global)

    const handleLogout = () => {
        deleteCookie("edo-state-token")
        dispatch(setSideBarOpen(false))
        dispatch(setIsLoggedIn(false))
        onSuccessResponse('Logged Out Successfully')
        navigate('/')
    }

    return (
        <>
            {/* Background Overlay */}
            {isSideBarOpen && <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={() => dispatch(setSideBarOpen(false))}></div>}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col p-4 z-50 transition-transform duration-300
                ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                
                {/* Header with Logo & Close Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src="/assets/images/logo.png" alt="Logo" className="w-12" />
                        <h2 className="text-green-900 font-semibold">
                            Edo State <br /> Ministry of Health
                        </h2>
                    </div>
                    {/* Close Button (Visible only on mobile) */}
                    <button title="close" type="button" onClick={() => dispatch(setSideBarOpen(false))} className="md:hidden cursor-pointer text-gray-700">
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-6">
                    <ul className="space-y-2">
                        {menuItems.map(({ path, label, icon }) => (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    end
                                    onClick={() => dispatch(setSideBarOpen(false))} 
                                    className={({ isActive }) =>
                                        `p-2 flex items-center gap-2 rounded-md transition ${
                                            isActive ? "bg-black text-white" : "text-black hover:bg-gray-200"
                                        }`
                                    }
                                >
                                    {icon} {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <button type="button" onClick={handleLogout} className="cursor-pointer mt-auto flex items-center justify-center bg-green-900 text-white py-2 rounded-md">
                    <LogoutIcon className="mr-2" />
                    Logout
                </button>
            </aside>
        </>
    );
};

export default SideBar;
