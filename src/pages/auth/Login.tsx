import React, { useEffect, useState } from "react"
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { decryptStr, deleteCookie, getCookie, onErrorResponse, onSuccessResponse, setCookie } from "../../utils/custom-functions";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { setIsLoggedIn } from "../../redux/slices/globalSlice";
import { RootState } from "../../redux/store";

interface Values {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface ResponseData {
    status: boolean;
    message: string;
    data: {
        token: string;
    };
    timestamp: number;
}

const Login: React.FC = () => {

    const dispatch = useDispatch();
    const { redirect } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const login = async (values: Values): Promise<ResponseData> => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
            body: JSON.stringify(values),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json();
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { mutate, isPending } = useMutation<ResponseData, Error, Values>({
        mutationFn: login,
    });
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required("Email address is required"),
        password: Yup.string().required("Password is required"),
    })

    const formik = useFormik<Values>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validationSchema,
        onSubmit: values => {
            mutate(values, {
                onSuccess: ({ data, message }) => {
                    onSuccessResponse(message);
                    setCookie("edo-state-token", data.token, 2);
                    if (values.rememberMe) {
                        const encodedLogin = decryptStr(values.email);
                        const encodedPassword = decryptStr(values.password);
                        const login = {
                            login: encodedLogin,
                            password: encodedPassword,
                        };
                        setCookie("edo-state-login", JSON.stringify(login), 720);
                    } else {
                        deleteCookie("edo-state-token")
                    }
                    dispatch(setIsLoggedIn(true));
                    navigate(redirect ?? "/dashboard");
                },
                onError: onErrorResponse,
            });
        }
    })

    useEffect(() => {
        // document.title = `Login - ${process.env.APP_NAME}`;
        const login = getCookie("edo-state-login");
        if (login) {
            try {
                const loginData = JSON.parse(login);
                formik.setFieldValue("email", decryptStr(loginData.login));
                formik.setFieldValue("password", decryptStr(loginData.password));
                formik.setFieldValue("rememberMe", true);
            } catch (error) {
                console.error("Error parsing login cookie", error);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg flex-col md:flex-row">
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10">
                    <div className="flex items-center">
                        <img src="/assets/images/logo.png" alt="Logo" className="w-16 mb-4" />
                        <h4 className="text-green-900 ml-2">
                            Edo State <br /> Ministry of Health
                        </h4>
                    </div>

                    <h2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900">
                        Kindly enter your log in details.
                    </h2>

                    <form className="mt-4" onSubmit={formik.handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                defaultValue={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                                className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 ${formik.errors.email && formik.touched.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-green-600 focus:outline-none"}`}
                            />
                            {formik.errors.email && formik.touched.email && <span className="text-red-700 mt-1 block">{formik.errors.email}</span>}
                        </div>

                        {/* Password Input */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    id="password"
                                    defaultValue={formik.values.password}
                                    type={passwordVisible ? "text" : "password"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="********"
                                    className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-14 text-gray-900 ${formik.errors.password && formik.touched.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "focus:border-green-600 focus:outline-none"}`}
                                />
                                {/* Visibility Icon */}
                                <div
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-4 flex h-full items-center text-gray-600 cursor-pointer"
                                >
                                    {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </div>
                            </div>
                            {formik.errors.password && formik.touched.password && <span className="text-red-700 mt-1 block">{formik.errors.password}</span>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="mb-4 flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2 rounded border-gray-300 bg-transparent" onChange={formik.handleChange} checked={formik.values.rememberMe} name="rememberMe" id="rememberMe" />
                                <span className="text-sm text-gray-700">Remember password</span>
                            </label>
                            <Link to="auth/forgotten-password" className="text-sm font-semibold text-green-700 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={!(formik.isValid && formik.dirty) || isPending}
                            className={`w-full cursor-pointer rounded-md ${!(formik.isValid && formik.dirty) || isPending ? `bg-[#AFAFAF] border border-bg-[#AFAFAF]` : `bg-green-700 hover:bg-green-800`} px-4 py-2 text-white transition`}
                        >
                            {isPending ? <CircularProgress size={20} color="inherit" /> : "Login"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Powered by <span className="font-semibold text-purple-600">Radah Technologies</span>
                    </div>
                </div>

                {/* Right Section - Image (Hidden on Small Screens) */}
                <div className="hidden md:flex w-full md:w-1/2 p-6 md:p-16">
                    <img
                        src="/assets/images/login-image.png"
                        alt="Surgery"
                        className="h-full w-full object-cover rounded-md"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login