"use client";

import { useState, useEffect } from "react";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/DashboardLayout/Sidebar";
import Navbar from "../components/DashboardLayout/Navbar";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebarContext } from "../../contexts/SidebarContext";
import CreateTaskContent from "../components/ItJob/CreateTaskContent";
import PendingTasksContent from "../components/ItJob/PendingTasksContent";
import InProgressTasksContent from "../components/ItJob/InProgressTasksContent";
import { useUser } from "@/contexts/UserContext";
import AllTasksContent from "../components/ItJob/AllTasksContent";

const itJob = () => {
  const { activeMenu } = useSidebarContext();
  //console.log("Active Menu in Page.js:", activeMenu);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard1":
        return <DashboardContent />;
      case "Create JOB":
        return <CreateTaskContent />;
      case "Pending Tasks":
        return <PendingTasksContent />;
      case "In Progress Tasks":
        return <InProgressTasksContent />;
      case "Completed Tasks":
        return <CompletedTasksContent />;
      case "All Tasks":
        return <AllTasksContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">{renderContent()}</div>
    </div>
  );

};







/* Content Components */
const DashboardContent = () => {
  const { theme } = useTheme();

  console.log("Current Theme Color:", theme.primaryColor);
  console.log("Current Theme Weight:", theme.primaryWeight);

  return (
    <div
      className='flex-1 min-h-screen overflow-auto p-16 bg-gray-100 dark:bg-gray-800'
    >
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-700 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Theme Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This page demonstrates the selected theme and weight in action.
        </p>
        <div
          className={`p-4 rounded-md ${theme.primaryColor && theme.primaryWeight
            ? `${theme.primaryColor}-${theme.primaryWeight}`
            : "bg-gray-300"
            }`}
        >
          <span className="text-white font-semibold">
            {theme.primaryColor && theme.primaryWeight
              ? `Current Theme: ${theme.primaryColor}-${theme.primaryWeight}`
              : "No Theme Selected"}
          </span>
        </div>
      </div>
    </div>
  );
};





const CompletedTasksContent = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // จำนวนงานต่อหน้า
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    if (!user?.fullName) {
      console.error("User fullName is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/it-job/completedJob?fullName=${encodeURIComponent(user.fullName)}&page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setJobs(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching completed jobs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, page]); // เรียก API เมื่อเปลี่ยน page หรือ user

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && jobs.length === 0 && <p>No completed jobs found.</p>}
      {!loading &&
        jobs.map((job) => (
          <div key={job._id}>
            <p>{job.jobName}</p>
          </div>
        ))}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};









export default withAuth(itJob, ["admin", "user"]);