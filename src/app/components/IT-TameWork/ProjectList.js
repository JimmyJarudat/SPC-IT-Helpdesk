'use client'

import React, { useState, useEffect } from "react";
import { FaTasks, FiSearch, FiPlus, FiGrid, FiList, FiMoreVertical, FiClock, FiDollarSign, FiTag, FiEye } from "react-icons/fi";
import { FiEdit2, FiTrash2, FiInfo, FiFolder, FiCalendar, FiType, FiActivity, FiUser, FiUsers, FiUserPlus, FiDownload, FiAlertTriangle, FiCheckSquare, FiEdit, FiTrash, FiX, FiChevronDown, FiChevronUp, FiPaperclip } from "react-icons/fi";
import Select, { components } from "react-select";
import { useUser } from "@/contexts/UserContext";

import ProjectListHeader from "./components/ProjectListHeader";
import ProjectCard from "./components/ProjectCard";
import ProjectListItem from "./components/ProjectListItem";
import CreateProjectModal from './components/CreateProjectModal';

import OverviewSection from "./components/OverviewSection";
import TasksSection from "./components/TaskSection";
import MilestoneSection from "./components/MilestoneSection";
import RiskSection from "./components/RickSection";
import AttachmentsSection from "./components/AttachmentsSection";

const ProjectList = () => {
    const { user } = useUser();
    const [isGridView, setIsGridView] = useState(true);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [isCreateProjectPopupOpen, setIsCreateProjectPopupOpen] = useState(false);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [userSearch, setUserSearch] = useState("");

    const [isProjectDetailPopupOpen, setIsProjectDetailPopupOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [expandedTasks, setExpandedTasks] = useState({});
    const [activeTab, setActiveTab] = useState("Overview");
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle tab switching
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    const openProjectDetailPopup = (project) => {
        setSelectedProject(project);
        setIsProjectDetailPopupOpen(true);
    };

    const closeProjectDetailPopup = () => {
        setSelectedProject(null);
        setIsProjectDetailPopupOpen(false);
    };

    useEffect(() => {
        let timeoutId;

        async function fetchUsers() {
            setSearchLoading(true); // ใช้ searchLoading แทน loading
            try {
                const response = await fetch(`/api/it-tamework/project?type=users&search=${encodeURIComponent(userSearch || "")}`);
                if (!response.ok) throw new Error("Failed to fetch users.");
                const result = await response.json();

                if (result.success) {
                    const formattedUsers = result.data.map((user) => ({
                        value: user._id,
                        label: `${user.fullName} (${user.nickName})`,
                        username: user.username,
                        profileImage: user.profileImage,
                    }));
                    setAvailableMembers(formattedUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error.message);
            } finally {
                setSearchLoading(false); // ใช้ searchLoading แทน loading
            }
        }

        // Debounce search
        if (userSearch) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fetchUsers();
            }, 300);
        } else {
            fetchUsers(); // Load initial data
        }

        return () => clearTimeout(timeoutId);
    }, [userSearch]);

    const togglePopup = () => setIsCreateProjectPopupOpen(!isCreateProjectPopupOpen);

    const toggleDropdown = (projectId) => {
        setDropdownOpen((prev) => (prev === projectId ? null : projectId));
    };
    // แก้ไขฟังก์ชัน handleCreateProject
    const handleCreateProject = async (formData) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/it-tamework/project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create project");
            }

            setProjects((prev) => [...prev, data.data]);
            setIsCreateProjectPopupOpen(false);
        } catch (error) {
            alert(error.message || "Failed to create project");
            console.error("Error creating project:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/it-tamework/project?type=projects`);
                if (!response.ok) throw new Error("Failed to fetch projects.");
                const data = await response.json();
                setProjects(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".relative")) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-500';
            case 'completed':
                return 'bg-blue-500';
            case 'in progress':
                return 'bg-yellow-500';
            case 'on hold':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };


    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-red-500';
            case 'medium':
                return 'text-yellow-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    // Utility Functions to be added to the component
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportProjectData = (project) => {
        // Placeholder for export functionality
        console.log('Exporting project data:', project);

        // You might want to implement actual export logic
        // For example, generating a PDF or Excel file
        alert('Export functionality to be implemented');
    };

   
    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    if (loading) {
        return <div className="p-6 text-gray-700 dark:text-gray-300">Loading projects...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

            {/* Header */}
            <ProjectListHeader
                isGridView={isGridView}
                setIsGridView={setIsGridView}
                togglePopup={togglePopup}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Project Display */}
            {isGridView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project._id || `project-${project.name}`}
                            project={project}
                            formatDate={formatDate}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                            dropdownOpen={dropdownOpen}
                            toggleDropdown={toggleDropdown}
                            openProjectDetailPopup={openProjectDetailPopup}
                            onEdit={(id) => console.log("Edit", id)}
                            onDelete={(id) => console.log("Delete", id)}
                        />
                    ))}
                </div>
            )}

            {!isGridView && (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <ProjectListItem
                            key={project._id || `project-${project.name}`}
                            project={project}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                            dropdownOpen={dropdownOpen}
                            toggleDropdown={toggleDropdown}
                            onViewDetails={openProjectDetailPopup}
                            onEdit={(id) => console.log("Edit", id)}
                            onDelete={(id) => console.log("Delete", id)}
                        />
                    ))}
                </div>
            )}

            {isCreateProjectPopupOpen && (
                <CreateProjectModal
                    isOpen={isCreateProjectPopupOpen}
                    onClose={togglePopup}
                    onSubmit={handleCreateProject}
                    availableMembers={availableMembers}
                    isLoading={isLoading}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                />
            )}

            {isProjectDetailPopupOpen && selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Header with Gradient and Detailed Info */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            {selectedProject.name}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedProject.status === 'Active'
                                                ? 'bg-green-500'
                                                : 'bg-blue-500'
                                                }`}>
                                                {selectedProject.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedProject.priority === 'High'
                                                ? 'bg-red-500'
                                                : selectedProject.priority === 'Medium'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                                }`}>
                                                {selectedProject.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-white text-opacity-80">
                                        {selectedProject.description || "No description available"}
                                    </p>
                                </div>
                                <button
                                    onClick={closeProjectDetailPopup}
                                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                >
                                    <FiX size={24} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content with Tabbed Navigation */}
                        <div className="flex-1 overflow-hidden">
                            <div className="grid grid-cols-12 h-full">
                                {/* Sidebar Navigation */}
                                <div className="col-span-2 bg-gray-100 dark:bg-gray-900 p-4 border-r dark:border-gray-700">
                                    <nav className="space-y-2">
                                        {[
                                            { icon: <FiAlertTriangle />, label: 'Overview', tab: 'Overview' },
                                            { icon: <FiCheckSquare />, label: 'Tasks', tab: 'Tasks' },
                                            { icon: <FiTag />, label: 'Milestones', tab: 'Milestones' },
                                            { icon: <FiEye />, label: 'Risks', tab: 'Risks' },
                                            { icon: <FiPaperclip />, label: 'Attachments', tab: 'Attachments' }
                                        ].map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleTabChange(item.tab)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-left ${activeTab === item.tab ? "bg-gray-200 dark:bg-gray-700" : ""
                                                    }`}
                                            >
                                                {item.icon}
                                                <span className="text-sm">{item.label}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>


                                {/* Main Content Area */}
                                <div
                                    className="col-span-10 overflow-y-auto p-6 space-y-6  pb-40"
                                    style={{
                                        minHeight: '400px', // ความสูงขั้นต่ำ
                                        maxHeight: '600px', // ความสูงสูงสุด (Optional)
                                        overflowY: 'auto', // เปิดการเลื่อนเมื่อเนื้อหาเกินความสูง
                                    }}
                                >

                                    {activeTab === "Overview" && (
                                        <OverviewSection
                                            selectedProject={selectedProject}
                                            formatDate={formatDate}
                                        />
                                    )}

                                    {/* Tasks Section */}
                                    {activeTab === "Tasks" && (
                                        <TasksSection
                                            selectedProject={selectedProject}
                                            formatDate={formatDate}
                                            getStatusColor={getStatusColor}
                                            expandedTasks={expandedTasks}
                                            setExpandedTasks={setExpandedTasks}
                                        />
                                    )}

                                    {/* Milestones Section */}
                                    {activeTab === "Milestones" && (
                                        <MilestoneSection
                                            selectedProject={selectedProject}
                                            formatDate={formatDate}
                                        />
                                    )}

                                    {/* Risks Section */}
                                    {activeTab === "Risks" && (
                                        <RiskSection
                                            selectedProject={selectedProject}
                                            formatDate={formatDate}
                                        />
                                    )}

                                    {/* Attachments Section */}
                                    {activeTab === "Attachments" && (
                                        <AttachmentsSection
                                            selectedProject={selectedProject}
                                            formatDate={formatDate}
                                        />
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 border-t dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <FiClock className="text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Last Modified: {formatDateTime(selectedProject.lastModifiedAt)}
                                        </span>
                                    </div>
                                    {selectedProject.lastModifiedBy && (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`/api/profile/getImage/${selectedProject.lastModifiedBy.username}.${selectedProject.lastModifiedBy.profileImageExtension || 'jpg'}`}
                                                alt={selectedProject.lastModifiedBy.fullName}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                by {selectedProject.lastModifiedBy.fullName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        onClick={closeProjectDetailPopup}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                        onClick={() => {
                                            // Implement export functionality
                                            exportProjectData(selectedProject);
                                        }}
                                    >
                                        <FiDownload />
                                        Export Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ProjectList;