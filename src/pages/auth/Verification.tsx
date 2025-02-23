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

const Verification: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);

    const { data, loading, error, fetchData } = useFetch(null);

    const validationSchema = Yup.object({
        otp: Yup.number().required("otp is required")
    })

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (loading) return;

            try {
                await fetchData("/verify-fpw-otp", { method: "POST", body: JSON.stringify(values) });

                if (error) {
                    onErrorResponse({ message: error });
                    return;
                }
                dispatch(setResetPasswordData({ reset_token: data.reset_token }))
            } catch (err) {
                console.error("Forgot password error:", err);
            }
        },
    })

    useEffect(() => {
        if (data) {
            onSuccessResponse(data.message);
            navigate('auth/reset-password');
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
                        disabled={!(formik.isValid && formik.dirty) || loading}
                        className={`w-full cursor-pointer rounded-md ${!(formik.isValid && formik.dirty) || loading
                            ? `bg-[#AFAFAF] border border-bg-[#AFAFAF]`
                            : `bg-green-700 hover:bg-green-800`
                            } px-4 py-2 text-white transition`}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
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

export default Verification