import React from 'react'
import axiosInstance from '../../api/axiosConfig';

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from 'react-query';
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';

interface Values {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface ResponseData {
    status: boolean;
    data: {
        token: string;
    };
    timestamp: number;
}

const ForgottenPassword: React.FC = () => {

    const forgottenPassword = async (values: Values): Promise<ResponseData> => {
        return await axiosInstance.post("/user/login", values);
    };

    const { mutate, isLoading } = useMutation<ResponseData, Error, Values>(forgottenPassword);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required("Email address is required")
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validationSchema,
        onSubmit: values => {
            mutate(values, {
                onSuccess: ({ data }) => {
                    console.log(data)
                    onSuccessResponse("Login Successful");
                    // dispatch(setUserData({ isLoggedIn: true, ...data.user }));
                    // navigate.push(redirect ?? "/dashboard");
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
                    Kindly enter your log in details.
                </h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your email"
                            className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 ${formik.errors.email && formik.touched.email
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "focus:border-green-600 focus:outline-none"
                                }`}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <span className="text-red-700 mt-1 block">{formik.errors.email}</span>
                        )}
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
            </div>
        </div>
    )
}

export default ForgottenPassword