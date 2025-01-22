import React, { useState } from 'react';
import { FiCheckSquare, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const TasksSection = ({ 
  selectedProject, 
  formatDate,
  getStatusColor,
  expandedTasks,
  setExpandedTasks 
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Event handlers
  const handleEdit = (e, taskId) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  };

  const handleDelete = (e, taskId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Add delete logic here
      console.log('Delete task:', taskId);
    }
  };

  const handleExpandToggle = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Filter and sort tasks
  const tasks = selectedProject?.tasks || [];
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.endDate || 0) - new Date(b.endDate || 0);
      case 'priority':
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      default:
        return 0;
    }
  });

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <FiCheckSquare className="text-blue-500" />
            Tasks ({tasks.length})
          </h3>
          <div className="flex gap-2">
            <select 
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm border-0 focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>
            <select 
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm border-0 focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => setShowAddTaskModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <FiPlus className="text-lg" />
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <div
              key={task.taskId || index}
              className="border dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Task Header */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 cursor-pointer"
                onClick={() => handleExpandToggle(task.taskId)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {task.title || 'Untitled Task'}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>Due: {formatDate(task.endDate)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs 
                        ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {task.priority || 'No Priority'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleEdit(e, task.taskId)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, task.taskId)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                  {expandedTasks[task.taskId] ? 
                    <FiChevronUp className="w-5 h-5 text-gray-500" /> :
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </div>
              </div>

              {/* Task Details */}
              {expandedTasks[task.taskId] && (
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <>
                            <img
                              src={`/api/profile/getImage/${task.assignee.username}.${task.assignee.profileImageExtension || 'jpg'}`}
                              alt={task.assignee.fullName}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/profile/getImage/placeholder.png";
                              }}
                            />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {task.assignee.fullName}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {formatDate(task.startDate)} - {formatDate(task.endDate)}
                      </p>
                    </div>
                  </div>

                  {task.description && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg mb-4">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-800 dark:text-gray-200">{task.description}</p>
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">Comments</h5>
                    <div className="space-y-3">
                      {(task.comments || []).map((comment, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={`/api/profile/getImage/${comment.user?.username}.${comment.user?.profileImageExtension || 'jpg'}`}
                              alt={comment.user?.fullName}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/profile/getImage/placeholder.png";
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {comment.user?.fullName || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <FiCheckSquare className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No tasks available</p>
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
            >
              <FiPlus />
              Create First Task
            </button>
          </div>
        )}
      </div>

      {/* TODO: Add Task Modal Component */}
      {showAddTaskModal && (
        // Add your modal component here
        null
      )}
    </section>
  );
};

export default TasksSection;