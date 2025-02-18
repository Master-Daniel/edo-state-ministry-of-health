import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'

const ViewSubmissions: React.FC = () => {
    return (
        <main className="flex-1 p-6 sm:ml-0 lg:ml-64">
            <DashboardHeader />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-5">
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                            <div className="border-gray-300 rounded-md">
                                <img src="/assets/images/department.png" alt="Logo" className="w-full h-auto" />
                            </div>
                            <h2 className="text-green-900 font-semibold text-center mt-2">
                                Edo State Ministry of Health
                            </h2>
                            <button type="button" className="border text-black rounded-md border-black p-2 w-full mt-2">Share Form</button>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default ViewSubmissions
