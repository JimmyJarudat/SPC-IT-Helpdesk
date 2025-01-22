'use client';

import React, { useEffect, useState } from 'react';

export default function KpiPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/kpi')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900">
                <div className="loader text-blue-500 dark:text-blue-300"></div>
                <p className="ml-4 text-gray-900 dark:text-gray-100">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="text-red-500 font-semibold">{`เกิดข้อผิดพลาด: ${error}`}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    ลองอีกครั้ง
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">สถานะระบบ NAS</h1>
            {data.map((nas, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {`NAS: ${nas.ip}`}
                        <span className={`ml-2 font-bold ${nas.error ? 'text-red-500' : 'text-green-500'}`}>
                            {nas.error ? 'Offline' : 'Online'}
                        </span>
                    </h2>
                    {nas.error ? (
                        <p className="text-red-500">{nas.error}</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Total Summary */}
                                <div className="bg-blue-100 dark:bg-blue-900 shadow rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-2">Total Summary</h3>
                                    <p>Total Size: {nas.totalSummary.totalSize || 'N/A'}</p>
                                    <p>Total Used: {nas.totalSummary.totalUsed || 'N/A'}</p>
                                    <p>Total Free: {nas.totalSummary.totalFree || 'N/A'}</p>
                                </div>
                                {/* Current Summary */}
                                <div className="bg-green-100 dark:bg-green-900 shadow rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-2">Current Summary</h3>
                                    <p>Total Size: {nas.currentSummary.totalSize}</p>
                                    <p>Total Free: {nas.currentSummary.totalFree}</p>
                                    <p>Usage Percent: {nas.currentSummary.usagePercent}</p>
                                </div>
                            </div>

                            
                             
                            {/* Details Table 
                            <div className="overflow-auto">
                                <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Filesystem</th>
                                            <th className="border px-4 py-2">Size</th>
                                            <th className="border px-4 py-2">Used</th>
                                            <th className="border px-4 py-2">Available</th>
                                            <th className="border px-4 py-2">Use Percent</th>
                                            <th className="border px-4 py-2">Mounted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nas.currentDetails.map((detail, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                                                <td className="border px-4 py-2">{detail.filesystem}</td>
                                                <td className="border px-4 py-2">{detail.size}</td>
                                                <td className="border px-4 py-2">{detail.used}</td>
                                                <td className="border px-4 py-2">{detail.available}</td>
                                                <td className="border px-4 py-2">{detail.usePercent}</td>
                                                <td className="border px-4 py-2">{detail.mounted}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                           
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">รายละเอียดทั้งหมด</h3>
                                <div className="overflow-auto">
                                    <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2">Filesystem</th>
                                                <th className="border px-4 py-2">Size</th>
                                                <th className="border px-4 py-2">Used</th>
                                                <th className="border px-4 py-2">Available</th>
                                                <th className="border px-4 py-2">Use Percent</th>
                                                <th className="border px-4 py-2">Mounted</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nas.totalDetails && nas.totalDetails.length > 0 ? (
                                                nas.totalDetails.map((detail, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                                                        <td className="border px-4 py-2">{detail.filesystem}</td>
                                                        <td className="border px-4 py-2">{detail.size}</td>
                                                        <td className="border px-4 py-2">{detail.used}</td>
                                                        <td className="border px-4 py-2">{detail.available}</td>
                                                        <td className="border px-4 py-2">{detail.usePercent}</td>
                                                        <td className="border px-4 py-2">{detail.mounted}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="border px-4 py-2 text-center">
                                                        ไม่มีข้อมูลที่จะแสดง
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            */}
                        </>
                    )}
                </div>
            ))}
        </div>
    );

}
