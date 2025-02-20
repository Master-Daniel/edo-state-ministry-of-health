import React, { useEffect, useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';
import DashboardHeader from '../../components/DashboardHeader';
import axiosInstance from '../../api/axiosConfig';
import StatsCard from '../../components/StatsCard';

interface Evaluation {
    id: number;
    evaluation_id: number;
    form_title: string;
    submitted_by: string;
    facility_name: string;
    rating: string;
    percentage: number;
}

const Welcome: React.FC = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 5,
        totalPages: 1,
        nextPageUrl: null as string | null,
        prevPageUrl: null as string | null,
    });

    const tabs = ["Recent", "Top Performing", "Unanswered", "Archived", "Graded"];

    const fetchEvaluations = async (tab: string, page: number = 1) => {
        try {
            const url = `/evaluation/${tab}?page=${page}&perPage=${pagination.perPage}`;
            const response = await axiosInstance.get(url);

            if (response.data.status) {
                const data = response.data.data;
                setEvaluations(data.data);
                setPagination({
                    currentPage: parseInt(data.pagination.currentPage),
                    perPage: parseInt(data.pagination.perPage),
                    totalPages: data.pagination.totalPages,
                    nextPageUrl: data.pagination.nextPageUrl,
                    prevPageUrl: data.pagination.prevPageUrl,
                });
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };


    useEffect(() => {
        fetchEvaluations(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredEvaluations = evaluations.filter(
        evalItem => evalItem.form_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evalItem.submitted_by.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (url: string | null) => {
        if (url) {
            fetchEvaluations(activeTab);
        }
    };

    return (
        <main className="flex-1 p-4 sm:p-6 max-w-full md:p-6 lg:ml-64">
            <DashboardHeader />
            <StatsCard />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                {/* Tabs */}
                <div className="flex flex-wrap border-b overflow-x-auto">
                    {tabs.map((tab) => {
                        const tabKey = tab.replace(" ", "-").toLowerCase();
                        return (
                            <button
                                type="button"
                                key={tab}
                                className={`cursor-pointer px-4 py-2 whitespace-nowrap text-gray-600 ${activeTab.replace(" ", "-").toLowerCase() === tabKey ? "border-b-2 border-green-700 text-green-700 font-semibold" : ""}`}
                                onClick={() => setActiveTab(tabKey)}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative w-full">
                    <ReorderOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search forms"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 border text-gray-600 border-gray-300 rounded-md focus:outline-none"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Table Container */}
                <div className="mt-4 overflow-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">
                                    <input
                                        type="checkbox"
                                        aria-label="checkbox"
                                        checked={selected.length === evaluations.length}
                                        onChange={() =>
                                            setSelected(selected.length === evaluations.length ? [] : evaluations.map((e) => e.evaluation_id))
                                        }
                                        className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                    />
                                </th>
                                {["S/N", "Form Name", "Submitted By", "Date", "Rating", "Score"].map((head) => (
                                    <th key={head} className="p-2 text-gray-700">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvaluations.map((evalItem, index) => (
                                <tr key={evalItem.id ?? index} className="border-t">
                                    <td className="p-2">
                                        <input
                                            aria-label="select"
                                            type="checkbox"
                                            checked={selected.includes(evalItem.evaluation_id)}
                                            onChange={() => setSelected((prev) =>
                                                prev.includes(evalItem.evaluation_id)
                                                    ? prev.filter((id) => id !== evalItem.evaluation_id)
                                                    : [...prev, evalItem.evaluation_id]
                                            )}
                                        />
                                    </td>
                                    <td className="p-2 text-black truncate">{evalItem.form_title || "N/A"}</td>
                                    <td className="p-2 text-black truncate">{evalItem.submitted_by}</td>
                                    <td className="p-2 text-black truncate">{evalItem.facility_name}</td>
                                    <td className="p-2 flex">
                                        {[...Array(5)].map((_, i) =>
                                            i < Math.round(parseFloat(evalItem.rating)) ? (
                                                <StarIcon key={i} className="text-yellow-500" />
                                            ) : (
                                                <StarBorderIcon key={i} className="text-gray-300" />
                                            )
                                        )}
                                    </td>
                                    <td className="p-2 text-black">{evalItem.percentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button type="button" className="cursor-pointer px-4 py-2 text-black rounded-md border border-gray-300 disabled:opacity-50" disabled={!pagination.prevPageUrl} onClick={() => handlePageChange(pagination.prevPageUrl)}>Prev</button>
                        <span className='text-black'>{pagination.currentPage} of {pagination.totalPages}</span>
                        <button type="button" className="cursor-pointer px-4 py-2 text-black rounded-md border border-gray-300 disabled:opacity-50" disabled={!pagination.nextPageUrl} onClick={() => handlePageChange(pagination.nextPageUrl)}>Next</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Welcome;
