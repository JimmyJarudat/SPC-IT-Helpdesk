import React from 'react';
import { 
  FiInfo, FiFolder, FiCalendar, FiDollarSign, 
  FiType, FiActivity, FiUsers, FiCheckSquare, FiUserPlus 
} from 'react-icons/fi';

const OverviewSection = ({ selectedProject, formatDate }) => {
  return (
    <section className="space-y-8">
      {/* Overview Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FiInfo className="text-blue-500" /> Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiFolder className="text-2xl text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Group</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {selectedProject.group || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiCalendar className="text-2xl text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiDollarSign className="text-2xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                ${selectedProject.budget?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiType className="text-2xl text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Type</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {selectedProject.projectType || "Not Specified"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiActivity className="text-2xl text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Status</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {selectedProject.status || "Not Set"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg flex items-center gap-3">
            <FiUsers className="text-2xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Manager</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {selectedProject.projectManager?.fullName || "Unassigned"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FiCheckSquare className="text-green-500" /> Progress
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${selectedProject.progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>0%</span>
          <span>{selectedProject.progress || 0}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiUserPlus className="text-purple-500" /> Team Members
          </h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
            <FiUserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {selectedProject.members?.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-750 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={member.profileImage || "/api/profile/getImage/placeholder.png"}
                  alt={member.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/profile/getImage/placeholder.png";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {member.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {member.role || 'Team Member'}
                  </p>
                </div>
                <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <FiUserPlus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          {(!selectedProject.members || selectedProject.members.length === 0) && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <FiUsers className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No team members yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;