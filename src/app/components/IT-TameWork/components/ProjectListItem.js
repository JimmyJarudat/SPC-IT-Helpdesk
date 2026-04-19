import React from 'react';
import { 
  FiMoreVertical, FiEye, FiEdit, FiTrash 
} from 'react-icons/fi';

const ProjectListItem = ({
  project,
  getStatusColor,
  getPriorityColor,
  dropdownOpen,
  toggleDropdown,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          {/* Team Members */}
          <div className="flex -space-x-2">
            {project.members?.slice(0, 3).map((member, index) => (
              <div key={`${project._id}-member-${index}`} className="relative group">
                <img
                  src={member.username
                    ? `/api/profile/getImage/${member.username}.${member.profileImageExtension || 'jpg'}`
                    : "/api/profile/getImage/placeholder.png"
                  }
                  alt={`Member ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/profile/getImage/placeholder.png";
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {member.fullName}
                </div>
              </div>
            ))}
            {project.members?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                {project.name}
              </h2>
              <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)} text-white`}>
                {project.status}
              </div>
              <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Progress */}
          <div className="text-sm">
            <div className="text-gray-600 dark:text-gray-400">Progress</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div
                  className="h-2 bg-green-500 rounded-lg transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {project.progress}%
              </span>
            </div>
          </div>

          {/* Tasks Counter */}
          <div className="text-sm min-w-[80px]">
            <div className="text-gray-600 dark:text-gray-400">Tasks</div>
            <div className="text-center text-gray-800 dark:text-gray-200">
              {project.tasks?.filter(task => task.status === 'Completed')?.length || 0} / 
              {project.tasks?.length || 0}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(project)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="View Details"
            >
              <FiEye className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => toggleDropdown(project._id)}
                title="More Actions"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>
              {dropdownOpen === project._id && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => onViewDetails(project)}
                    >
                      <FiEye className="text-gray-500" />
                      View Details
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => onEdit(project._id)}
                    >
                      <FiEdit className="text-gray-500" />
                      Edit
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => onDelete(project._id)}
                    >
                      <FiTrash className="text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;