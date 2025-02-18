import React from 'react'
import DashboardHeader from '../../components/DashboardHeader'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../../components/StatsCard';

const ManageEvaluations: React.FC = () => {

    const data = [
        { name: 'JAN', value1: 10, value2: 5 },
        { name: 'FEB', value1: 20, value2: 10 },
        { name: 'MAR', value1: 30, value2: 20 },
        { name: 'APR', value1: 50, value2: 30 },
        { name: 'MAY', value1: 70, value2: 40 },
        { name: 'JUN', value1: 60, value2: 50 },
        { name: 'JUL', value1: 80, value2: 55 },
        { name: 'AUG', value1: 65, value2: 45 },
        { name: 'SEP', value1: 85, value2: 60 },
        { name: 'OCT', value1: 95, value2: 70 },
        { name: 'NOV', value1: 90, value2: 75 },
        { name: 'DEC', value1: 100, value2: 85 }
    ];

    const pieData = [
        { name: 'Answered', value: 1257, color: '#3B82F6' },
        { name: 'Unanswered', value: 432, color: '#10B981' },
        { name: 'Archived', value: 123, color: '#F87171' }
    ];

    return (
        <main className="flex-1 p-6 ml-64">
            <DashboardHeader />
            <StatsCard />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-100 min-h-screen">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white p-4 shadow rounded-lg">
                    <ResponsiveContainer width="100%" height={200} className="min-h-[200px]">
                        <LineChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value1" stroke="#3B82F6" strokeWidth={2} />
                            <Line type="monotone" dataKey="value2" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-4 shadow rounded-lg">
                    <ResponsiveContainer width="100%" height={200} className="min-h-[200px]">
                        <BarChart data={data.slice(6)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value1" fill="#60A5FA" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart with Labels */}
                <div className="lg:col-span-2 bg-white p-4 shadow rounded-lg flex flex-col sm:flex-row items-center justify-center sm:justify-around">
                    <PieChart width={160} height={160}>
                        <Pie data={pieData} dataKey="value" outerRadius={60} label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                        {pieData.map((item) => (
                            <div key={item.name} className="text-center">
                                <div
                                    className="w-4 h-4 inline-block rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-lg font-semibold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second Line Chart */}
                <div className="bg-white p-4 shadow rounded-lg">
                    <ResponsiveContainer width="100%" height={200} className="min-h-[200px]">
                        <LineChart data={data.slice(0, 7)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value1" stroke="#14B8A6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </main>
    )
}

export default ManageEvaluations