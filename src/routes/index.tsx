import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgottenPassword from "../pages/auth/ForgottenPassword";
import Verification from "../pages/auth/Verification";
import ResetPassword from "../pages/auth/ResetPassword";
import Welcome from "../pages/dashboard/Welcome";
import Layout from "../pages/dashboard/Layout";
import ManageEvaluations from "../pages/dashboard/ManageEvaluations";
import ManagePassCodes from "../pages/dashboard/ManagePasscodes";
import ViewSubmissions from "../pages/dashboard/ViewSubmissions";
import Profile from "../pages/dashboard/Profile";
import Settings from "../pages/dashboard/Settings";
import Create from "../pages/form/Create";
import FormLayout from "../pages/form/FormLayout";
import LoginPassCode from "../pages/form/LoginPasscode";
import FormPreview from "../pages/form/FormPreview";
import Submission from "../pages/form/Submission";

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
                    { index: true, element: <ManageEvaluations /> },
                    { path: 'manage-evaluations', element: <Welcome /> },
                    { path: 'manage-passcodes', element: <ManagePassCodes /> },
                    { path: 'view-submissions', element: <ViewSubmissions /> },
                    { path: 'profile', element: <Profile /> },
                    { path: 'settings', element: <Settings /> },
                   
                ],
            },
            {
                path: "form",
                element: <FormLayout />,
                children: [
                    { path: 'create-form', element: <Create /> },
                    { path: 'passcode', element: <LoginPassCode /> },
                    { path: 'preview', element: <FormPreview /> },
                    { path: 'submission', element: <Submission /> },
                ],
            },
            // { path: "*", element: <NotFound /> }, // Catch-all for unknown routes
        ],
    },
]);

export default router;
