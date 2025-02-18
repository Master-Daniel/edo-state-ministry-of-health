import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
import Login from "../pages/auth/Login";
import ForgottenPassword from "../pages/auth/ForgottenPassword";
// import Home from "../pages/Home";
// import About from "../pages/About";
// import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/", children: [
            { index: true, element: <Login /> },
            { path: "auth/forgotten-password", element: <ForgottenPassword /> },
            // { path: "*", element: <NotFound /> },
        ]
    },
]);

export default router;
