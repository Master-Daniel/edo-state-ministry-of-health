import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DashboardHeader from "../../components/DashboardHeader";
import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  decryptStr,
  deleteCookie,
  getCookie,
  onErrorResponse,
  onSuccessResponse,
  setCookie,
} from "../../utils/custom-functions";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { setIsLoggedIn } from "../../redux/slices/globalSlice";
import { RootState } from "../../redux/store";
import { useFetch } from "../../hooks/useFetch";
import FormHeader from "../../components/FormHeader";

const LoginPassCode: React.FC = () => {
  const dispatch = useDispatch();
  const { redirect } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);
  const [passcodeVisible, setpasscodeVisible] = useState(false);
  const { fetchData, loading } = useFetch(null);

  const togglepasscodeVisibility = () => {
    setpasscodeVisible(!passcodeVisible);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    passcode: Yup.string().required("passcode is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      passcode: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const { data, error } = await fetchData("/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (error) {
        onErrorResponse({ message: error });
        return;
      }

      if (data) {
        onSuccessResponse(data.message);
        setCookie("edo-state-token", data.data.token, 2);
        if (values.rememberMe) {
          const login = {
            login: decryptStr(values.email),
            passcode: decryptStr(values.passcode),
          };
          setCookie("edo-state-login", JSON.stringify(login), 720);
        } else {
          deleteCookie("edo-state-token");
        }
        dispatch(setIsLoggedIn(true));
        navigate(redirect ?? "/dashboard");
      }
    },
  });

  useEffect(() => {
    // document.title = `Login - ${process.env.APP_NAME}`;
    const login = getCookie("edo-state-login");
    if (login) {
      try {
        const loginData = JSON.parse(login);
        formik.setFieldValue("email", decryptStr(loginData.login));
        formik.setFieldValue("passcode", decryptStr(loginData.passcode));
        formik.setFieldValue("rememberMe", true);
      } catch (error) {
        console.error("Error parsing login cookie", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <FormHeader />

      <div
        className="row justify-center items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-5 px-4">
          <h2
            style={{ background: "#003F1C" }}
            className="mb-2 text-lg text-center md:text-xl font-semibold text-white p-2"
          >
            DIVISION OF REGULATION AND MONITORING
          </h2>

          <div className="flex items-center justify-center py-5 my-5">
            <img src="/assets/images/logo.png" alt="Logo" className="w-16" />
            <h4 className="text-green-900 ml-2">
              Edo State <br /> Ministry of Health
            </h4>
          </div>

          <form className="mt-4" onSubmit={formik.handleSubmit}>
            {/* passcode Input */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">
                Passcode
              </label>
              <div className="relative">
                <input
                  name="passcode"
                  id="passcode"
                  defaultValue={formik.values.passcode}
                  type={passcodeVisible ? "text" : "passcode"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Please your departmental passcode"
                  className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                    formik.errors.passcode && formik.touched.passcode
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "focus:border-green-600 focus:outline-none"
                  }`}
                />
              </div>
              {formik.errors.passcode && formik.touched.passcode && (
                <span className="text-red-700 mt-1 block">
                  {formik.errors.passcode}
                </span>
              )}
            </div>

            {/* submit Button */}
            <Link to="/form/preview">
              <button
                type="submit"
                // disabled={!(formik.isValid && formik.dirty) || loading}
                className={`w-full cursor-pointer rounded-4 py-3 ${
                  !(formik.isValid && formik.dirty) || loading
                    ? `bg-[#00662D] border border-bg-[#00662D]`
                    : `bg-green-700 hover:bg-green-800`
                } px-4 py-2 text-white transition`}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Submit"
                )}
              </button>
            </Link>
          </form>

          {/* Footer */}
          <div className="mt-6 justify-center gap-2 text-center flex text-sm text-gray-500 tracking-widest">
            Powered by{" "}
            <img
              src="/assets/images/radah-logo.png"
              className="font-semibold w-20 h-6"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPassCode;
