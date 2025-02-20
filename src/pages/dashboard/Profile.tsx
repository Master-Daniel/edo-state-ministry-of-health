import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'

const Profile: React.FC = () => {
    return (
        <main className="flex-1 p-4 sm:p-6 max-w-full md:p-6 lg:ml-64">
            <DashboardHeader />
            <h1 className='text-black text-3xl p-5'>Profile</h1>
        </main>
    )
}

export default Profile