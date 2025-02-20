import React, { useEffect } from 'react'
import axiosInstance from '../api/axiosConfig';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setStats } from '../redux/slices/globalSlice';

const StatsCard: React.FC = () => {
    const dispatch = useDispatch();
    const { stats } = useSelector((state: RootState) => state.global);

    useEffect(() => {
        (async () => {
            const { data } = await axiosInstance.get('/dashboard/stats');
            dispatch(setStats(data));
        })();
    }, [dispatch]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
                {
                    title: "Total Evaluations",
                    count: stats?.total_evaluation ?? 0,
                    icon: <ImportContactsOutlinedIcon fontSize="small" />,
                    bgColor: "bg-[#FF9090]"
                },
                {
                    title: "New Evaluations",
                    count: stats?.new_evaluations ?? 0,
                    icon: <NotificationsActiveOutlinedIcon fontSize="small" />,
                    bgColor: "bg-[#79E4FF]"
                },
                {
                    title: "Average Score",
                    count: `${stats?.average_score ?? 0}%`,
                    icon: <TrendingUpOutlinedIcon fontSize="small" />,
                    bgColor: "bg-[#FF73C5]"
                },
                {
                    title: "Centers Evaluated",
                    count: stats?.evaluated_centers ?? 0,
                    icon: <HomeOutlinedIcon fontSize="small" />,
                    bgColor: "bg-[#FFB854]"
                },
            ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    {/* Icon */}
                    <span className={`flex p-4 items-center justify-center rounded-full h-6 w-6 ${stat.bgColor} text-black`}>
                        {stat.icon}
                    </span>

                    {/* Title & Count */}
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-black w-22 break-words whitespace-normal font-bold">{stat.title}</p>
                        <p className="font-bold text-4xl text-black">{stat.count}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCard;
