"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSidebarContext } from "../../../contexts/SidebarContext";
import DashboardContent from "../../components/ItJob/DashboardContent";
import CreateTaskContent from "../../components/ItJob/CreateTaskContent";
import PendingTasksContent from "../../components/ItJob/PendingTasksContent";
import InProgressTasksContent from "../../components/ItJob/InProgressTasksContent";
import CompletedTasksContent from "../../components/ItJob/CompletedTasksContent";
import AllTasksContent from "../../components/ItJob/AllTasksContent";

const ItJobTabPage = () => {
  const { tab } = useParams();
  const { setActiveMenu } = useSidebarContext();

  // แปลง URL path กลับเป็นชื่อเมนู
  const getMenuName = (urlPath) => {
    const menuMap = {
      'dashboard': 'Dashboard',
      'create-job': 'Create JOB',
      'pending-tasks': 'Pending Tasks',
      'in-progress-tasks': 'In Progress Tasks',
      'completed-tasks': 'Completed Tasks',
      'all-tasks': 'All Tasks'
    };
    return menuMap[urlPath] || 'Dashboard';
  };

  useEffect(() => {
    const menuName = getMenuName(tab);
    setActiveMenu(menuName);
  }, [tab, setActiveMenu]);

  // เลือก component ตาม URL path
  const getContent = () => {
    switch (tab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'create-job':
        return <CreateTaskContent />;
      case 'pending-tasks':
        return <PendingTasksContent />;
      case 'in-progress-tasks':
        return <InProgressTasksContent />;
      case 'completed-tasks':
        return <CompletedTasksContent />;
      case 'all-tasks':
        return <AllTasksContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">{getContent()}</div>
    </div>
  );
};

export default ItJobTabPage;