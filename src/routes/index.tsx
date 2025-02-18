import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
import Login from "../pages/auth/Login";
import ForgottenPassword from "../pages/auth/ForgottenPassword";
import Verification from "../pages/auth/Verification";
import ResetPassword from "../pages/auth/ResetPassword";
import Welcome from "../pages/dashboard/Welcome";
import Layout from "../pages/dashboard/Layout";
import ManageEvaluations from "../pages/dashboard/ManageEvaluations";
import ManagePassCodes from "../pages/dashboard/ManagePasscodes";
import ViewSubmissions from "../pages/dashboard/ViewSubmissions";

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            { index: true, element: <Login /> },
            { path: "auth/forgotten-password", element: <ForgottenPassword /> },
            { path: "auth/verification", element: <Verification /> },
            { path: "auth/reset-password", element: <ResetPassword /> },
            {
                path: "dashboard",
                element: <Layout />,
                children: [
                    { index: true, element: <Welcome /> },
                    { path: 'manage-evaluations', element: <ManageEvaluations /> },
                    { path: 'manage-passcodes', element: <ManagePassCodes /> },
                    { path: 'view-submissions', element: <ViewSubmissions /> },
                ],
            },
            // { path: "*", element: <NotFound /> }, // Catch-all for unknown routes
        ],
    },
]);

export default router;
