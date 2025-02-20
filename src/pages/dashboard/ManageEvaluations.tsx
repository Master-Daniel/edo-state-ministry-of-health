import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import StatsCard from '../../components/StatsCard';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables, ChartOptions, Plugin } from 'chart.js';

Chart.register(...registerables);

const ManageEvaluations: React.FC = () => {

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: '',
                borderColor: 'red',
                data: [20, 40, 30, 50, 80, 60, 90, 70, 85, 95, 100, 110],
                fill: false,
            },
            {
                label: 'Dataset 2',
                borderColor: 'blue',
                data: [10, 30, 50, 20, 60, 90, 50, 80, 70, 110, 120, 130],
                fill: false,
            },
        ],
    };

    const barData = {
        labels: ['July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Data',
            backgroundColor: ['#FAD02E', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#C9CBCF'],
            data: [50, 30, 40, 80, 60, 90],
        }],
    };

    const doughnutData = {
        labels: [],
        datasets: [{
            data: [1257, 432, 123],
            backgroundColor: ['#4C83FF', '#6EE7B7', '#FF6384'],
        }],
    };

    const smallLineData = {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [{
            label: 'Weekly Data',
            borderColor: '#36A2EB',
            data: [2000, 3000, 2500, 4000, 4500, 3200, 2800],
            fill: false,
        }],
    };

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