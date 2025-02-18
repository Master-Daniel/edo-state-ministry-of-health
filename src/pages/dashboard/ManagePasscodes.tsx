import React, { useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { CircularProgress } from '@mui/material';
import axiosInstance from '../../api/axiosConfig';
import { useMutation } from "@tanstack/react-query";
import * as Yup from 'yup';

interface Values {
    department: string;
    passCode: string;
    confirmPassCode: string;
}

interface ResponseData {
    status: boolean;
    data: {
        token: string;
    };
    timestamp: number;
}

const Button: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`rounded-md p-3 border w-28 cursor-pointer ${isActive ? 'text-[#00662D] border-[#00662D1A] bg-[#00662D1A]' : 'text-black border-gray-300'}`}
        >
            {label}
        </button>
    )
}

const PAGE_SIZE = 5;

const validationSchema = Yup.object({
    department: Yup.string().required('Department is required'),
    passCode: Yup.string().min(4, 'Passcode must be at least 4 characters').required('Passcode is required'),
    confirmPassCode: Yup.string()
        .oneOf([Yup.ref('passCode')], 'Passcodes must match')
        .required('Confirm passcode is required')
});

const ManagePassCodes: React.FC = () => {
    const [activeBar, setActiveBar] = useState('create')
    const [selected, setSelected] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const evaluations = [...Array(8)].map((_, i) => ({
        id: i + 1,
        name: i % 2 === 0 ? "Health facility evaluation" : "Employee training quiz",
        user: `User ${i + 1}`,
        date: `0${i + 1}/Dec/2024`,
        rating: (i % 5) + 1,
        score: `${50 + i * 5}%`
    }));

    const totalPages = Math.ceil(evaluations.length / PAGE_SIZE);
    const displayedEvaluations = evaluations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const createPassCode = async (values: Values): Promise<ResponseData> => {
        return await axiosInstance.post("/login", values);
    };

    const { mutate, isPending } = useMutation<ResponseData, Error, Values>({
        mutationFn: createPassCode
    });

    const formik = useFormik({
        initialValues: { department: '', passCode: '', confirmPassCode: '' },
        validationSchema,
        onSubmit: values => {
            mutate(values);
        }
    });

    // Handle individual row selection
    const handleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Handle selecting/unselecting all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelected([]);
        } else {
            setSelected(evaluations.map((evalItem) => evalItem.id));
        }
        setSelectAll(!selectAll);
    };

    return (
        <main className="flex-1 p-6 sm:ml-0 lg:ml-64">
            <DashboardHeader />
            <div className="flex flex-wrap gap-3 py-5">
                {['create', 'edit'].map((tab) => (
                    <Button
                        key={tab}
                        label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                        isActive={activeBar === tab}
                        onClick={() => setActiveBar(tab)}
                    />
                ))}
            </div>
            {activeBar === 'create' ? (
                <div className="bg-white p-5 rounded-md shadow w-full md:w-3/6">
                    <form onSubmit={formik.handleSubmit}>
                        {(['department', 'passCode', 'confirmPassCode'] as const).map((field) => (
                            <div key={field} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field === 'confirmPassCode' ? 'Confirm Passcode' : field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    aria-label={field}
                                    name={field}
                                    type={field.toLowerCase().includes('passcode') ? 'password' : 'text'}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[field as keyof typeof formik.values]}
                                    className={`mt-1 w-full text-black rounded-md border px-3 py-2 ${formik.errors[field as keyof typeof formik.errors] && formik.touched[field as keyof typeof formik.touched]
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                />
                                {formik.errors[field as keyof typeof formik.errors] && formik.touched[field as keyof typeof formik.touched] && (
                                    <span className="text-red-700 mt-1 block">{formik.errors[field as keyof typeof formik.errors]}</span>
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!(formik.isValid && formik.dirty) || isPending}
                                className={`w-24 rounded-md ${!(formik.isValid && formik.dirty) || isPending
                                        ? 'bg-[#AFAFAF] border border-bg-[#AFAFAF]'
                                        : 'bg-green-700 hover:bg-green-800'
                                    } px-4 py-2 text-white transition`}
                            >
                                {isPending ? <CircularProgress size={20} color="inherit" /> : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#093D20] text-left text-white">
                                <th className="p-2">
                                    <input
                                        aria-label="select"
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                    />
                                </th>
                                <th className="p-2 font-normal">S/N</th>
                                <th className="p-2 font-normal">Department</th>
                                <th className="p-2 font-normal">PassCode Date</th>
                                <th className="p-2 font-normal">PassCode</th>
                                <th className="p-2 font-normal"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEvaluations.map((evalItem, index) => (
                                <tr key={evalItem.id} className="border-t bg-white border-gray-200">
                                    <td className="p-2">
                                        <input
                                            aria-label="select"
                                            type="checkbox"
                                            checked={selected.includes(evalItem.id)}
                                            onChange={() => handleSelect(evalItem.id)}
                                            className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                        />
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.name}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.user}</td>
                                    <td className="p-2 text-[#3A3A3A] font-bold text-4xl">
                                        ........{' '}
                                        <Link to="#" className="text-base text-green-900 font-semibold" onClick={() => { }}>
                                            Edit
                                        </Link>
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center md:justify-end mt-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 mx-1 border rounded cursor-pointer ${currentPage === i + 1 ? 'bg-green-900 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </main>
    )
}

export default ManagePassCodes
