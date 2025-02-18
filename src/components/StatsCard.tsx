import React from 'react'
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

const StatsCard: React.FC = () => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-6">
            {[
                {
                    title: "Total Evaluations", count: 94, icon: <span className="flex p-4 items-center justify-center rounded-full h-6 w-6 text-black bg-[#FF9090]">
                        <ImportContactsOutlinedIcon fontSize="small" />
                    </span>
                },
                {
                    title: "New Evaluations", count: 13, icon: <span className="flex p-4 items-center justify-center rounded-full h-6 w-6 text-black bg-[#79E4FF]">
                        <NotificationsActiveOutlinedIcon fontSize="small" />
                    </span>
                },
                {
                    title: "Average Score", count: "77%", icon: <span className="flex p-4 items-center justify-center rounded-full h-6 w-6 text-black bg-[#FF73C5]">
                        <TrendingUpOutlinedIcon fontSize="small" />
                    </span>
                },
                {
                    title: "Centers Evaluated", count: 150, icon: <span className="flex p-4 items-center justify-center rounded-full h-6 w-6 text-black bg-[#FFB854]">
                        <HomeOutlinedIcon fontSize="small" />
                    </span>
                },
            ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className="flex justify-between">
                        <p className="text-black w-22 break-words whitespace-normal font-bold">{stat.title}</p>
                        <p className="font-bold text-4xl text-black">{stat.count}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsCard