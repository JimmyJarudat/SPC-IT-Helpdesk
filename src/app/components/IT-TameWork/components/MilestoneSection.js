import React, { useState } from 'react';
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiCheck, FiX, FiChevronRight, FiFlag } from 'react-icons/fi';

const MilestoneSection = ({ selectedProject, formatDate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleEdit = (milestoneId) => {
    setEditingId(milestoneId);
  };

  const handleDelete = (milestoneId) => {
    // Add delete logic here
    console.log('Delete milestone:', milestoneId);
  };

  const getMilestoneStatus = (milestone) => {
    const now = new Date();
    const dueDate = new Date(milestone.dueDate);
    
    if (milestone.completed) {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: <FiCheck className="w-4 h-4" />
      };
    } else if (dueDate < now) {
      return {
        label: 'Overdue',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: <FiX className="w-4 h-4" />
      };
    } else {
      return {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: <FiFlag className="w-4 h-4" />
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FiTag className="text-indigo-500" />
          Milestones
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiPlus className="w-5 h-5" />
          Add Milestone
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Add New Milestone</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Milestone Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter milestone name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="Enter milestone description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                Create Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="grid gap-4">
        {selectedProject?.milestones?.map((milestone, index) => {
          const status = getMilestoneStatus(milestone);
          return (
            <div
              key={milestone.id || index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {milestone.name}
                    </h4>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {milestone.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                      Due: {formatDate(milestone.dueDate)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiChevronRight className="w-4 h-4" />
                      {milestone.dependsOn ? `Depends on: ${milestone.dependsOn}` : 'No dependencies'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(milestone.id)}
                    className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {editingId === milestone.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Milestone Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                        defaultValue={milestone.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        defaultValue={milestone.description}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                        defaultValue={milestone.dueDate}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {(!selectedProject?.milestones || selectedProject.milestones.length === 0) && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FiTag className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No milestones available</p>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
            >
              <FiPlus />
              Add First Milestone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneSection;