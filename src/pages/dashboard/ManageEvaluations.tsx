import React, { useEffect, useMemo, useState } from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import StatsCard from '../../components/StatsCard';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables, ChartOptions, Plugin } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

Chart.register(...registerables);

interface EvaluationData {
    month: string;
    average_percentage: number;
    total_evaluation: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label?: string;
        borderColor?: string;
        backgroundColor?: string[];
        data: number[];
        fill?: boolean;
    }[];
}

const months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const ManageEvaluations: React.FC = () => {

    const { stats } = useSelector((state: RootState) => state.global);

    // Memoize the monthly_evaluation_distribution data
    const monthly_evaluation_distribution = useMemo((): EvaluationData[] => {
        return stats?.monthly_evaluation_distribution || [];
    }, [stats]);

    const [lineData, setLineData] = useState<ChartData>({
        labels: months,
        datasets: [
            {
                label: "Average Percentage",
                borderColor: "red",
                data: Array(12).fill(0),
                fill: false,
            },
            {
                label: "Total Evaluations",
                borderColor: "blue",
                data: Array(12).fill(0),
                fill: false,
            },
        ],
    });

    const [barData, setBarData] = useState<ChartData>({
        labels: months.slice(6), // Last 6 months
        datasets: [
            {
                label: "Monthly Data",
                backgroundColor: ["#FAD02E", "#FF6384", "#36A2EB", "#4BC0C0", "#9966FF", "#C9CBCF"],
                data: Array(6).fill(0),
            },
        ],
    });

    const [doughnutData, setDoughnutData] = useState<ChartData>({
        labels: months,
        datasets: [
            {
                data: Array(12).fill(0),
                backgroundColor: ["#4C83FF", "#6EE7B7", "#FF6384"],
            },
        ],
    });

    const [smallLineData, setSmallLineData] = useState<ChartData>({
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [
            {
                label: "Weekly Data",
                borderColor: "#36A2EB",
                data: Array(7).fill(0), // Default empty
                fill: false,
            },
        ],
    });

    useEffect(() => {
        if (!monthly_evaluation_distribution.length) return;

        const averagePercentages: number[] = Array(12).fill(0);
        const totalEvaluations: number[] = Array(12).fill(0);

        monthly_evaluation_distribution.forEach(({ month, average_percentage, total_evaluation }) => {
            const [monthName] = month.split(" "); // Extract month name
            const index = months.indexOf(monthName); // Get index based on name

            if (index !== -1) {
                averagePercentages[index] = average_percentage;
                totalEvaluations[index] = total_evaluation;
            }
        });

        // Update Line Chart Data
        setLineData((prev) => ({
            ...prev,
            datasets: [
                { ...prev.datasets[0], data: averagePercentages },
                { ...prev.datasets[1], data: totalEvaluations },
            ],
        }));

        // Update Bar Chart Data (Last 6 months)
        setBarData((prev) => ({
            ...prev,
            datasets: [{ ...prev.datasets[0], data: averagePercentages.slice(6) }],
        }));

        // Update Doughnut Chart Data (Using total evaluations)
        setDoughnutData((prev) => ({
            ...prev,
            datasets: [{ ...prev.datasets[0], data: totalEvaluations }],
        }));

        // Update Small Line Chart Data (Weekly trend)
        const weeklyData = totalEvaluations.slice(-7); // Last 7 months as weekly trend
        setSmallLineData((prev) => ({
            ...prev,
            datasets: [{ ...prev.datasets[0], data: weeklyData.length === 7 ? weeklyData : Array(7).fill(0) }],
        }));
    }, [monthly_evaluation_distribution]);

    const doughnutOptions: ChartOptions<"doughnut"> = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: "70%", // Creates the hole in the middle
        plugins: {
            legend: {
                display: false, // Hide default legend if needed
            },
        },
    };

    const doughnutCenterTextPlugin: Plugin<"doughnut"> = {
        id: "doughnutCenterText",
        beforeDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.restore();

            const fontSize = Math.min(width, height) / 10; // Adjust font size dynamically
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const text = "100%"; // The text to display
            const textX = width / 2;
            const textY = height / 2;

            ctx.fillStyle = "#333"; // Text color
            ctx.fillText(text, textX, textY);
            ctx.save();
        },
    };

    const barOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
        },
    };

    return (
        <main className="flex-1 p-4 md:p-6 lg:ml-64">
            <DashboardHeader />
            <StatsCard />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 md:py-6 bg-gray-100 min-h-screen">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white p-4 shadow rounded-lg">
                    <Line data={lineData} className="w-full h-auto" />
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-4 shadow rounded-lg flex items-end h-full">
                    <Bar data={barData} options={barOptions} className="w-full h-full" />
                </div>

                {/* Doughnut Chart with Labels */}
                <div className="lg:col-span-2 w-full bg-white p-4 shadow rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between h-full">
                        {/* Doughnut Chart */}
                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                            <Doughnut
                                data={doughnutData}
                                options={doughnutOptions}
                                plugins={[doughnutCenterTextPlugin]}
                                className="w-full h-full"
                            />
                        </div>

                        {/* Labels Section */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                            <div className="bg-blue-100 text-blue-600 flex flex-col font-semibold px-4 py-2 rounded-md text-center">
                                <span className="text-black">Answered</span>
                                <span>1257</span>
                            </div>
                            <div className="bg-green-100 text-green-500 flex flex-col font-semibold px-4 py-2 rounded-md text-center">
                                <span className="text-black">Unanswered</span>
                                <span>432</span>
                            </div>
                            <div className="bg-red-100 text-red-500 flex flex-col font-semibold px-4 py-2 rounded-md text-center">
                                <span className="text-black">Archived</span>
                                <span>123</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Line Chart */}
                <div className="bg-white p-4 shadow rounded-lg flex items-end h-64">
                    <Line data={smallLineData} className="w-full h-full" />
                </div>
            </div>
        </main>
    )
}

export default ManageEvaluations