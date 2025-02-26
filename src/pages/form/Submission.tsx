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
import bg from "../../../public/assets/icons/bg.svg";
import alert from "../../../public/assets/icons/Alert.svg";

const Submission: React.FC = () => {
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

          <div className="flex flex-col justify-center items-center my-5">
            <img src={alert} alt="success" />
            <h4 className="text-2xl my-3">Submission Successful!</h4>
            <span>Your form has been submitted successfully</span>
          </div>

          <Link to="/dashboard/">
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
                "Finish"
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Submission;
