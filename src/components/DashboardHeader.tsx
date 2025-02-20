import React from 'react'
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useDispatch } from 'react-redux';
import { setSideBarOpen } from '../redux/slices/globalSlice';

const DashboardHeader: React.FC = () => {
    const dispatch = useDispatch()

    return (
        <div className="flex justify-between items-center rounded-md bg-white p-4 shadow-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button title="menu" className='text-gray-500 sm:hidden cursor-pointer' onClick={() => dispatch(setSideBarOpen(true))} type='button'>
                    <MenuOutlinedIcon />
                </button>
                <h1 className="text-xl font-semibold text-black">Welcome, Admin.</h1>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="hidden sm:flex space-x-4 items-center">
                    <Link to="" className="text-green-900 font-bold">Share Form</Link>
                    <Link to="" className="bg-green-900 text-white px-4 py-2 rounded-md">Create Form</Link>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader;
