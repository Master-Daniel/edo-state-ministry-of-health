import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ShortAnswerInput from "./ShortAnswerInput";
import CheckboxInput from "./CheckboxInput";
import DropdownInput from "./DropdownInput";
import Switch from "react-switch";
import { FiType, FiCheckSquare, FiChevronDown, FiList } from "react-icons/fi";
import copy from "../../public/assets/icons/copy.svg";
import deleteIcon from "../../public/assets/icons/delete.svg";
import options from "../../public/assets/icons/options.svg";
import { useDispatch } from "react-redux";
import MultipleChoiceInput from "./MultipleChoiceInput";

const FormSection: React.FC<{ showPoints?: boolean }> = ({}) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("");
  const [required, setRequired] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      questionType: "",
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
            password: decryptStr(values.password),
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

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const requiredHandler = (e) => {
    setRequired(!required);
  };

  return (
    <div className="form-section my-4">
      <div className="rounded-md bg-white p-4 shadow-md sticky top-0 z-20 min-h-screen/2 flex flex-col justify-between relative">
        <div className="row">
          <div className="col-md-8">
            <input
              name="question"
              id="question"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Question"
              className={`question-input mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 ${
                formik.errors.email && formik.touched.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-green-600 focus:outline-none"
              }`}
            />
          </div>
          <div className="col-md-4">
            <select
              id="questionType"
              name="questionType"
              onChange={(e) => {
                formik.handleChange(e);
                handleTypeChange(e);
              }}
              onBlur={formik.handleBlur}
              className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 ${
                formik.errors.questionType && formik.touched.questionType
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-green-600 focus:outline-none"
              }`}
            >
              <option value="">--Question type--</option>
              <option value="short-answer">
                <FiType className="inline mr-2" /> Short Answer
              </option>
              <option value="multiple-choice">
                <FiList className="inline mr-2" /> Multiple Choice
              </option>
              <option value="checkboxes">
                <FiCheckSquare className="inline mr-2" /> Checkboxes
              </option>
              <option value="dropdown">
                <FiChevronDown className="inline mr-2" /> Dropdown
              </option>
            </select>
          </div>
        </div>
        <div className="min-h-30 my-4">
          {selectedType === "short-answer" && <ShortAnswerInput />}
          {selectedType === "multiple-choice" && <MultipleChoiceInput />}
          {selectedType === "checkboxes" && <CheckboxInput />}
          {selectedType === "dropdown" && <DropdownInput />}
        </div>

        <div className="w-full py-3 px-4 mt-4 flex justify-end gap-4">
          <button className="text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={copy} alt="copy icon" className="ml-2" />
          </button>
          <button className="text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={deleteIcon} alt="delete icon" className="ml-2" />
          </button>
          <div className="d-flex  remember-switch">
            <label className="d-flex  align-items-center">
              <span className="ml-2"> Required</span>
              <Switch
                onChange={requiredHandler}
                checked={required}
                checkedIcon={false}
                uncheckedIcon={false}
                height={30}
                width={55}
                onColor="#219653"
                onHandleColor="#F6EFE9"
                offHandleColor="#f1f1f1"
                className="ml-2"
              />
            </label>
          </div>
          <button className="text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={options} alt="options icon" className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSection;
