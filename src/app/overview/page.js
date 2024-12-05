'use client'
import React, { useState } from "react";
import { FaDesktop } from "react-icons/fa";

const departments = [
    {
        name: "แผนกไอที",
        machines: ["IT-2001", "IT-2002"],
    },
    {
        name: "แผนกบุคคล",
        machines: ["HR-2001", "HR-2002"],
    },
    {
        name: "แผนกบัญชี",
        machines: ["AC-2001", "AC-2002"],
    },
];

const PMComputer = () => {
    const [expanded, setExpanded] = useState(null);

    const toggleAccordion = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
                {/* Header */}
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    PM คอมพิวเตอร์
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    รายการเครื่องคอมพิวเตอร์ที่ต้องทำ PM แยกตามแผนก
                </p>

                {/* Accordion for Departments */}
                <div className="space-y-4">
                    {departments.map((department, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md transition-all"
                        >
                            {/* Accordion Header */}
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleAccordion(index)}
                            >
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    {department.name}
                                </h3>
                                <span className="text-gray-600 dark:text-gray-300">
                                    {expanded === index ? "▲" : "▼"}
                                </span>
                            </div>

                            {/* Accordion Content */}
                            {expanded === index && (
                                <div className="mt-4 space-y-2">
                                    {department.machines.map((machine, machineIndex) => (
                                        <div
                                            key={machineIndex}
                                            className="bg-gray-100 dark:bg-gray-600 p-2 rounded-md shadow-sm"
                                        >
                                            <div className="text-gray-800 dark:text-white">
                                                {machine}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PMComputer;
