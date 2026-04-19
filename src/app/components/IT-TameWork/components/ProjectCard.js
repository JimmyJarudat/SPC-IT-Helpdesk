import React from 'react';
import {
  FiMoreVertical, FiCheckSquare, FiClock, FiDollarSign,
  FiTag, FiEye, FiEdit, FiTrash, FiPaperclip, FiAlertTriangle
} from 'react-icons/fi';

const ProjectCard = ({
  project,
  formatDate,
  getStatusColor,
  getPriorityColor,
  dropdownOpen,
  toggleDropdown,
  openProjectDetailPopup,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex-1 truncate">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
            {project.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {project.group}
            </span>
            {project.projectType && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {project.projectType}
              </span>
            )}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)} text-white`}>
          {project.status}
        </div>
        
        {/* Dropdown Menu */}
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={() => toggleDropdown(project._id)}
            title="More Actions"
          >
            <FiMoreVertical className="text-gray-500" />
          </button>
          {dropdownOpen === project._id && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => openProjectDetailPopup(project)}
              >
                <FiEye className="inline-block mr-2 text-gray-500" />
                View Details
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onEdit(project._id)}
              >
                <FiEdit className="inline-block mr-2 text-gray-500" />
                Edit
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onDelete(project._id)}
              >
                <FiTrash className="inline-block mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
         title={project.description}>
        {project.description}
      </p>

      {/* Milestones */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Milestones
        </h4>
        {project.milestones && project.milestones.length > 0 ? (
          <div className="space-y-2">
            {project.milestones.slice(0, 2).map((milestone, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {milestone.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(milestone.dueDate)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No milestones set</p>
        )}
      </div>

      {/* Key Risks */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Risks
        </h4>
        {project.risks && project.risks.length > 0 ? (
          <div className="space-y-2">
            {project.risks.slice(0, 2).map((risk, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">
                  <FiAlertTriangle size={14} />
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {risk.description}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      risk.probability === 'High' ? 'bg-red-100 text-red-800' :
                      risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.probability} Prob.
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                      risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No risks identified</p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] items-center">
        {project.tags && project.tags.length > 0 ? (
          project.tags.map((tag, index) => {
            const tagColors = [
              "bg-red-200 text-red-800",
              "bg-green-200 text-green-800",
              "bg-blue-200 text-blue-800",
              "bg-yellow-200 text-yellow-800",
              "bg-purple-200 text-purple-800",
              "bg-pink-200 text-pink-800",
              "bg-indigo-200 text-indigo-800"
            ];
            const randomColor = tagColors[index % tagColors.length];
            return (
              <span
                key={`${project._id}-tag-${index}`}
                className={`px-2 py-1 rounded-full text-xs ${randomColor}`}
              >
                <FiTag className="inline mr-1" />
                {tag}
              </span>
            );
          })
        ) : (
          <span className="text-gray-400 text-xs italic">
            No Tags
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            Progress {project.progress}%
          </span>
          <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority} Priority
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div
            className="h-2 bg-green-500 rounded-lg transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Timeline and Budget */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <FiClock className="text-gray-500 mr-2" />
          <div className="text-xs">
            <div className="text-gray-600 dark:text-gray-400">Start - End</div>
            <div className="text-gray-800 dark:text-gray-200">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <FiDollarSign className="text-gray-500 mr-2" />
          <div className="text-xs text-right">
            <div className="text-gray-600 dark:text-gray-400">Budget</div>
            <div className="text-gray-800 dark:text-gray-200">
              ${project.budget?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">
        {/* Team Members */}
        <div className="relative flex -space-x-2">
          {project.members?.slice(0, 5).map((member, index) => (
            <div key={`${project._id}-member-${index}`} className="relative group">
              <img
                src={member.username
                  ? `/api/profile/getImage/${member.username}.${member.profileImageExtension || 'jpg'}`
                  : "/api/profile/getImage/placeholder.png"
                }
                alt={`Member ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/profile/getImage/placeholder.png";
                }}
              />
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                {member.fullName}
              </div>
            </div>
          ))}
          {project.members?.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200">
              +{project.members.length - 5}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <FiCheckSquare className="text-blue-500 mr-1" />
            <span className="text-sm font-medium">
              {project.tasks?.filter(task => task.status === 'Completed').length || 0}/
              {project.tasks?.length || 0}
            </span>
          </div>
          {project.attachments?.length > 0 && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <FiPaperclip className="text-gray-500 mr-1" />
              <span className="text-sm">{project.attachments.length}</span>
            </div>
          )}
          {project.risks?.length > 0 && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <FiAlertTriangle className="text-yellow-500 mr-1" />
              <span className="text-sm">{project.risks.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;