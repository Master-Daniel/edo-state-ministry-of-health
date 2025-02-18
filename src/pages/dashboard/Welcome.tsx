import React, { useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';
import DashboardHeader from '../../components/DashboardHeader';
import StatsCard from '../../components/StatsCard';


const PAGE_SIZE = 5;

const Welcome: React.FC = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [selected, setSelected] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const evaluations = [
        { id: 1, name: "Health facility evaluation", user: "Joy Iyobosa", date: "04/Dec/2024", rating: 4, score: "78%" },
        { id: 2, name: "Employee training quiz", user: "Amos Osagiede", date: "30/Nov/2024", rating: 2, score: "40%" },
        { id: 3, name: "Health facility evaluation", user: "Paul Smart", date: "29/Nov/2024", rating: 3, score: "68%" },
        { id: 4, name: "Employee training quiz", user: "Leonie Effodu", date: "28/Nov/2024", rating: 5, score: "90%" },
        { id: 5, name: "Health facility evaluation", user: "Oshoke Idaewor", date: "27/Nov/2024", rating: 4, score: "86%" },
        { id: 6, name: "Employee training quiz", user: "Faith Ibomen", date: "26/Nov/2024", rating: 2, score: "23%" },
        { id: 7, name: "Employee training quiz", user: "Osasu Eloghosa", date: "25/Nov/2024", rating: 3, score: "55%" },
        { id: 8, name: "Employee training quiz", user: "Joseph Kosi", date: "22/Nov/2024", rating: 3, score: "46%" },
    ];

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

    const filteredEvaluations = evaluations.filter(
        evalItem => evalItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evalItem.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEvaluations.length / PAGE_SIZE);
    const displayedEvaluations = filteredEvaluations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <main className="flex-1 p-6 ml-64">
            <DashboardHeader />
            <StatsCard />

            {/* Tabs */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap border-b">
                    {["Recent Evaluations", "Top Performing", "Unanswered", "Archived", "Graded"].map((tab) => (
                        <button
                            type="button"
                            key={tab}
                            className={`px-4 py-2 cursor-pointer text-gray-600 ${activeTab === tab.split(" ")[0].toLowerCase()
                                    ? "border-b-2 border-green-700 text-green-700 font-semibold"
                                    : ""
                                }`}
                            onClick={() => setActiveTab(tab.split(" ")[0].toLowerCase())}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative w-full mx-auto">
                    <ReorderOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search forms"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 border text-gray-400 border-[#3A3A3A4D] rounded-md focus:outline-none"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Table */}
                <div className="mt-4 overflow-auto">
                    <table className="w-full min-w-max border-collapse">
                        <thead>
                            <tr className="bg-[#F7F7F7] text-left">
                                <th className="p-2">
                                    <input
                                        aria-label="select"
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                    />
                                </th>
                                <th className="p-2 text-[#3A3A3A]">S/N</th>
                                <th className="p-2 text-[#3A3A3A]">Form Name</th>
                                <th className="p-2 text-[#3A3A3A]">Submitted By</th>
                                <th className="p-2 text-[#3A3A3A]">Date</th>
                                <th className="p-2 text-[#3A3A3A]">Rating</th>
                                <th className="p-2 text-[#3A3A3A]">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEvaluations.map((evalItem, index) => (
                                <tr key={evalItem.id} className="border-t">
                                    <td className="p-2">
                                        <input
                                            aria-label="select"
                                            type="checkbox"
                                            checked={selected.includes(evalItem.id)}
                                            onChange={() => handleSelect(evalItem.id)}
                                            className="h-4 w-4 appearance-none border border-gray-400 rounded checked:border-green-600 checked:bg-transparent checked:[&:after]:content-['✔'] checked:[&:after]:text-green-600 checked:[&:after]:block checked:[&:after]:text-center checked:[&:after]:font-bold checked:[&:after]:leading-none"
                                        />
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]">
                                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.name}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.user}</td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.date}</td>
                                    <td className="p-2 text-[#3A3A3A]">
                                        {[...Array(5)].map((_, i) =>
                                            i < evalItem.rating ? (
                                                <StarIcon key={i} className="text-yellow-500" />
                                            ) : (
                                                <StarBorderIcon key={i} className="text-gray-300" />
                                            )
                                        )}
                                    </td>
                                    <td className="p-2 text-[#3A3A3A]">{evalItem.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex flex-wrap justify-center mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 cursor-pointer border-gray-400 text-gray-500 rounded-md mx-1"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`px-4 py-2 cursor-pointer border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-500 border-gray-400"
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="px-4 py-2 cursor-pointer border-gray-400 text-gray-500 rounded-md mx-1"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Welcome;
