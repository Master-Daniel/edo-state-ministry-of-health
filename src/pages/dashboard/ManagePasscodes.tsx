import React, { useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'

import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import { useFetch } from '../../hooks/useFetch';
import { onErrorResponse, onSuccessResponse } from '../../utils/custom-functions';

interface Values {
    department_id: string;
    name: string;
    passcode: string;
    passcode_confirmation: string;
}

type Evaluation = {
    department_id: string;
    name: string;
    passcode_date: string;
};

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
    name: Yup.string().required('Department is required'),
    passcode: Yup.string().min(4, 'Passcode must be at least 4 characters').required('Passcode is required'),
    passcode_confirmation: Yup.string()
        .oneOf([Yup.ref('passcode')], 'Passcodes must match')
        .required('Confirm passcode is required')
});

const ManagePassCodes: React.FC = () => {
    const [activeBar, setActiveBar] = useState('create')
    const [selected, setSelected] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const initialState = {
        text: 'Create',
        url: "/department/store"
    };
    
    const [action, setAction] = useState(initialState);
    const { data, fetchData, loading } = useFetch('/departments');
    const evaluations = data?.data || [];

    const totalPages = Math.ceil(evaluations.length / PAGE_SIZE);
    const displayedEvaluations = evaluations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const formik = useFormik<Values>({
        initialValues: { department_id: '', name: '', passcode: '', passcode_confirmation: '' },
        validationSchema,
        onSubmit: async (values) => {
            const { data, error } = await fetchData(action.url, {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (error) {
                console.log(error);
                
                onErrorResponse({ message: error });
                return;
            }

            if (data) {
                formik.resetForm();
                setAction(initialState);
                setActiveBar('create')
                fetchData('/departments')
                onSuccessResponse(data.message);
            }
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
            // setSelected(evaluations.map((evalItem) => evalItem.id));
        }
        setSelectAll(!selectAll);
    };

    const handleEdit = (evalItem: string) => {
        const item = evaluations.find((item: Evaluation) => item.department_id == evalItem)
        formik.setFieldValue('department_id', evalItem)
        formik.setFieldValue('name', item.name)
        setAction({ text: 'Update', url: '/department/update' })
        setActiveBar('update')
    }

    return (
        <main className="flex-1 p-6 sm:ml-0 lg:ml-64">
            <DashboardHeader />
            <div className="flex flex-wrap gap-3 py-5">
                {[action.text, 'edit'].map((tab) => (
                    <Button
                        key={tab}
                        label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                        isActive={activeBar.toLowerCase() == tab.toLowerCase()}
                        onClick={() => setActiveBar(tab)}
                    />
                ))}
            </div>
            {activeBar.toLowerCase() === 'create' || activeBar.toLowerCase() === 'update' ? ( 
                <div className="bg-white p-5 rounded-md shadow w-full md:w-3/6">
                    <form onSubmit={formik.handleSubmit}>
                        {(['name', 'passcode', 'passcode_confirmation'] as const).map((field) => (
                            <div key={field} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field === 'passcode_confirmation' ? 'Confirm Passcode' : field === 'name' ? 'Department' : field.charAt(0).toUpperCase() + field.slice(1)}
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
                        <div className={`flex justify-${action.text.toLowerCase() == 'create' ? 'end' : 'between'}`}>
                            {
                                action.text.toLowerCase() == 'update' && <Link to="#" onClick={() => {
                                    setActiveBar('create')
                                    setAction(initialState)
                                }} className='text-green-700 font-semibold text-base'>Reset Form</Link>
                            }
                            <button
                                type="submit"
                                disabled={!(formik.isValid && formik.dirty) || loading}
                                className={`w-24 cursor-pointer rounded-md ${!(formik.isValid && formik.dirty) || loading
                                    ? 'bg-[#AFAFAF] border border-bg-[#AFAFAF]'
                                    : 'bg-green-700 hover:bg-green-800'
                                    } px-4 py-2 text-white transition`}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : action.text}
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
                            {displayedEvaluations.map((evalItem: Evaluation, index: number) => (
                                <tr key={evalItem.department_id} className="border-t bg-white border-gray-200">
                                    <td className="p-2">
                                        <input
                                            aria-label="select"
                                            type="checkbox"
                                            checked={selected.includes(index)}
                                            onChange={() => handleSelect(index)}
                                            className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                        />
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.name}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.passcode_date}</td>
                                    <td className="p-2 text-[#3A3A3A] font-bold text-4xl">
                                        ........{' '}
                                        <Link to="#" onClick={() => handleEdit(evalItem.department_id)} className="text-base text-green-900 font-semibold">
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
