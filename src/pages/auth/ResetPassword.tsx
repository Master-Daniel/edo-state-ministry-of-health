import React, { useState } from 'react'
import axiosInstance from '../../api/axiosConfig';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from 'react-query';
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';
import { Link, useNavigate } from 'react-router-dom';

interface Values {
    password: string;
    confirm_password: string;
}

interface ResponseData {
    status: boolean;
    data: {
        message: string;
    };
    timestamp: number;
}

const ResetPassword: React.FC = () => {

    const navigate = useNavigate()
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const resetPassword = async (values: Values): Promise<ResponseData> => {
        return await axiosInstance.post("/reset-password", values);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const { mutate, isLoading } = useMutation<ResponseData, Error, Values>(resetPassword);

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
        onSubmit: values => {
            mutate(values, {
                onSuccess: ({ data }) => {
                    onSuccessResponse(data.message);
                    navigate('/');
                },
                onError: onErrorResponse,
            });
        }
    })

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
                        disabled={!(formik.isValid && formik.dirty) || isLoading}
                        className={`w-full rounded-md ${!(formik.isValid && formik.dirty) || isLoading
                            ? `bg-[#AFAFAF] border border-bg-[#AFAFAF]`
                            : `bg-green-700 hover:bg-green-800`
                            } px-4 py-2 text-white transition`}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Request Reset"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Powered by <span className="font-semibold text-purple-600">Radah Technologies</span>
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Back to <Link to="/" className="font-semibold text-green-600">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword