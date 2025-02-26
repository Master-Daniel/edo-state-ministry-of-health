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

const FormPreview: React.FC = () => {
  const dispatch = useDispatch();
  const { redirect } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);
  const [xVisible, setxVisible] = useState(false);
  const { fetchData, loading } = useFetch(null);

  const togglexVisibility = () => {
    setxVisible(!xVisible);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    x: Yup.string().required("x is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      x: "",
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
            x: decryptStr(values.x),
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
        formik.setFieldValue("x", decryptStr(loginData.x));
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
        <div className="col-md-9 px-4">
          <h2
            style={{ background: "#003F1C" }}
            className="mb-2 text-lg text-center md:text-xl font-semibold text-white p-2"
          >
            DIVISION OF REGULATION AND MONITORING
          </h2>

          <form className="mt-4 px-3 text-xl" onSubmit={formik.handleSubmit}>
            {/* x Input */}
            <div className="row">
              <div className="col-md-4">
                <div className="mb-4 relative text-xl">
                  <label className="block font-medium text-gray-700">
                  Facility Name:
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Name of facility"
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4 relative">
                  <label className="block font-medium text-gray-700">
                  Facility Address:
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Address of facility"
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4 relative">
                  <label className="block font-medium text-gray-700">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please your departmental x"
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4 relative">
                  <label className="block font-medium text-gray-700">
                  Name of proprietor:
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please input  proprietor’s name "
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4 relative">
                  <label className="block font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please input phone no"
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4 relative">
                  <label className="block font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="x"
                      id="x"
                      defaultValue={formik.values.x}
                      type={xVisible ? "text" : "x"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please input email address"
                      className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 pr-14 text-gray-900 ${
                        formik.errors.x && formik.touched.x
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "focus:border-green-600 focus:outline-none"
                      }`}
                    />
                  </div>
                  {formik.errors.x && formik.touched.x && (
                    <span className="text-red-700 mt-1 block">
                      {/* {formik.errors.x} */}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <h5>Details of Facility</h5>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                1. Facility registration status?
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Registered</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">Not Registered</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  <span className="mr-2">Not Registered</span>In Process
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                2. Environment Cleanliness
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <input
                    type="text"
                    name="test1"
                    placeholder="Enter Short Answer"
                    id=""
                  />
                </div>
              </div>
            </div>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                3. Trained personnel on ground?
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Yes</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">No</span>
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                4. Referral center available?
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Yes</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">No</span>
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                5. Is the facility accessible?
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Yes</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">No</span>
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>
            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
                6. Monthly morbidity and mortality data available?
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Yes</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">No</span>
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>

            <div className="row py-3  text-xl">
              <label htmlFor="" className="bg-gray-200 py-2">
              7. Ventilation
              </label>
              <div className="flex py-2">
                <div className="form-group mr-5">
                  <span className="mr-2">Excellent</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  <span className="mr-2">Good</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  {" "}
                  <span className="mr-2">Average</span>
                  <input type="radio" name="test1" id="" />
                </div>
                <div className="form-group mr-5">
                  <span className="mr-2">Poor</span>In Process
                  <input type="radio" name="test1" id="" />
                </div>
              </div>
            </div>

            {/* submit Button */}
            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty) || loading}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
