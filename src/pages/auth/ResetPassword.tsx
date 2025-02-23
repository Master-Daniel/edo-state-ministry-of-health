import React, { useEffect, useState } from 'react'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useFetch } from '../../hooks/useFetch';

interface Values {
    password: string;
    confirm_password: string;
}

const ResetPassword: React.FC = () => {

    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { data, loading, error, fetchData } = useFetch(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters"),

        confirm_password: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Passwords must match"),
    });


    const formik = useFormik<Values>({
        initialValues: {
            password: '',
            confirm_password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (loading) return;

            try {
                await fetchData("/reset-password", { method: "POST", body: JSON.stringify(values) });

                if (error) {
                    onErrorResponse({ message: error });
                    return;
                }
            } catch (err) {
                console.error("Forgot password error:", err);
            }
        },
    })

    useEffect(() => {
        if (data) {
            onSuccessResponse(data.message);
            navigate('/');
        }
    }, [data, navigate]);

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-6">
                    <img src="/assets/images/logo.png" alt="Logo" className="w-16 mb-2" />
                    <h4 className="text-green-900 text-center text-lg font-semibold">
                        Edo State <br /> Ministry of Health
                    </h4>
                </div>

                <h2 className="mb-4 text-center text-xl font-semibold text-gray-900">
                    Forgotten Password?
                </h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                id="password"
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

                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                name="confirm_password"
                                id="confirm_password"
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
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-4 flex h-full items-center text-gray-600 cursor-pointer"
                            >
                                {confirmPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </div>
                        </div>
                        {formik.errors.password && formik.touched.password && <span className="text-red-700 mt-1 block">{formik.errors.password}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!(formik.isValid && formik.dirty) || loading}
                        className={`w-full cursor-pointer rounded-md ${!(formik.isValid && formik.dirty) || loading
                            ? `bg-[#AFAFAF] border border-bg-[#AFAFAF]`
                            : `bg-green-700 hover:bg-green-800`
                            } px-4 py-2 text-white transition`}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Request Reset"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 justify-center gap-2 text-center flex text-sm text-gray-500 tracking-widest">
                    Powered by <img src="/assets/images/radah-logo.png" className="font-semibold w-20 h-6" alt="" />
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Back to <Link to="/" className="font-semibold text-green-600">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword