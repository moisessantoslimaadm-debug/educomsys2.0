
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformanceData } from '../types';

interface PerformanceChartProps {
    data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgb(107 114 128)' }} fontSize={12} />
                    <YAxis tick={{ fill: 'rgb(107 114 128)' }} fontSize={12} />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4b5563',
                            borderRadius: '0.5rem',
                            color: '#fff',
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend iconSize={10} />
                    <Line type="monotone" dataKey="averageGrade" name="Média de Notas" stroke="#0066FF" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
