import React, { useEffect } from 'react'

import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setResetPasswordData } from '../../redux/slices/globalSlice';
import { RootState } from '../../redux/store';
import { useFetch } from '../../hooks/useFetch';

const ForgottenPassword: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);

    const { data, loading, error, fetchData } = useFetch(null);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required("Email address is required")
    })

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (loading) return;

            dispatch(setResetPasswordData({ email: values.email }));

            try {
                await fetchData("/request-fpw-otp", { method: "POST", body: JSON.stringify(values) });

                if (error) {
                    onErrorResponse({ message: error });
                    return;
                }
            } catch (err) {
                console.error("Forgot password error:", err);
            }
        },
    });

    // Handle successful response and navigation
    useEffect(() => {
        if (data) {
            onSuccessResponse(data.message);
            navigate('/auth/verification');
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

export default ForgottenPassword