import React from 'react'
import axiosInstance from '../../api/axiosConfig';

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setResetPasswordData } from '../../redux/slices/globalSlice';

interface Values {
    otp: string;
}

interface ResponseData {
    status: boolean;
    data: {
        message: string;
        reset_token: string;
    };
    timestamp: number;
}

const Verification: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const verification = async (values: Values): Promise<ResponseData> => {
        return await axiosInstance.post("/verify-fpw-otp", values);
    };
    
    const { mutate, isPending } = useMutation<ResponseData, Error, Values>({
        mutationFn: verification
    });
    
    const validationSchema = Yup.object({
        otp: Yup.number().required("otp is required")
    })
    
    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema,
        onSubmit: values => {
            mutate(values, {
                onSuccess: ({ data }) => {
                    onSuccessResponse(data.message);
                    dispatch(setResetPasswordData({ reset_token: data.reset_token }))
                    navigate('auth/reset-password');
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
                    Verification
                </h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">OTP</label>
                        <input
                            name="otp"
                            id="otp"
                            type="otp"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your otp"
                            className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 ${formik.errors.otp && formik.touched.otp
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "focus:border-green-600 focus:outline-none"
                                }`}
                        />
                        {formik.errors.otp && formik.touched.otp && (
                            <span className="text-red-700 mt-1 block">{formik.errors.otp}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!(formik.isValid && formik.dirty) || isPending}
                        className={`w-full rounded-md ${!(formik.isValid && formik.dirty) || isPending
                                ? `bg-[#AFAFAF] border border-bg-[#AFAFAF]`
                                : `bg-green-700 hover:bg-green-800`
                            } px-4 py-2 text-white transition`}
                    >
                        {isPending ? <CircularProgress size={20} color="inherit" /> : "Verify"}
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

export default Verification