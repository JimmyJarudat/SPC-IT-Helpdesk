import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  FiUser,
  FiSettings,
  FiPlus,
  FiMoreVertical,
  FiPaperclip,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";

// Modal Component
const CommentModal = ({ isOpen, onClose, taskId, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Comments for: {taskTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {/* Add your comments content here */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-800 dark:text-gray-200">
              Sample comment for task #{taskId}
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Posted by User - 2 hours ago
            </span>
          </div>
          
          {/* Comment input */}
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Add a comment..."
              rows="3"
            />
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DraggableCard = ({ id, title, type, date, comments, attachments, onCommentClick }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
  
    const handleCommentClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onCommentClick(id, title);
    };
  
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md flex flex-col space-y-2">
        {/* Drag Handle Area */}
        <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-move">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
              {type}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{date}</span>
          </div>
        </div>
  
        {/* Interactive Elements (Not Draggable) */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            {comments > 0 && (
              <button
                className="flex items-center text-gray-600 dark:text-gray-400 text-xs hover:text-blue-500"
                onClick={handleCommentClick}
              >
                <FiMessageSquare className="mr-1" /> {comments}
              </button>
            )}
            {attachments > 0 && (
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                <FiPaperclip className="mr-1" /> {attachments}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

const DroppableColumn = ({ id, name, tasks, onCommentClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md min-h-[300px]"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {name}
        </h2>
        <FiMoreVertical className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <DraggableCard
            key={task.id}
            id={task.id}
            title={task.title}
            type={task.type}
            date={task.date}
            comments={task.comments}
            attachments={task.attachments}
            onCommentClick={onCommentClick}
          />
        ))}
      </div>
    </div>
  );
};

const ScrumBoard = () => {
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      tasks: [
        {
          id: "1",
          title: "Unable to upload file",
          type: "Task",
          date: "August 05",
          comments: 1,
          attachments: 2,
        },
        {
          id: "2",
          title: "Table data incorrect",
          type: "Bug",
          date: "July 11",
          comments: 2,
          attachments: 0,
        },
      ],
    },
    inProgress: {
      name: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Fix dashboard layout",
          type: "Bug",
          date: "April 17",
          comments: 1,
          attachments: 0,
        },
        {
          id: "4",
          title: "New design",
          type: "Task",
          date: "May 20",
          comments: 1,
          attachments: 1,
        },
      ],
    },
    submitted: {
      name: "Submitted",
      tasks: [
        {
          id: "5",
          title: "Update node environment",
          type: "Low priority",
          date: "April 04",
          comments: 0,
          attachments: 0,
        },
      ],
    },
    completed: {
      name: "Completed",
      tasks: [
        {
          id: "6",
          title: "Ready to test",
          type: "Task",
          date: "April 04",
          comments: 0,
          attachments: 0,
        },
        {
          id: "7",
          title: "Slow API connection",
          type: "Bug",
          date: "August 19",
          comments: 0,
          attachments: 0,
        },
      ],
    },
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCommentClick = (taskId, taskTitle) => {
    setSelectedTask({ id: taskId, title: taskTitle });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    if (!isModalOpen) {  // Only allow drag if modal is closed
      setActiveId(event.active.id);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over || isModalOpen) return;  // Don't allow drops if modal is open

    const sourceColumnId = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === active.id)
    );
    const destinationColumnId = over.id;

    if (sourceColumnId !== destinationColumnId) {
      const sourceColumn = columns[sourceColumnId];
      const destinationColumn = columns[destinationColumnId];

      const sourceTasks = sourceColumn.tasks.filter((task) => task.id !== active.id);
      const movedTask = sourceColumn.tasks.find((task) => task.id === active.id);
      const destinationTasks = [...destinationColumn.tasks, movedTask];

      setColumns({
        ...columns,
        [sourceColumnId]: { ...sourceColumn, tasks: sourceTasks },
        [destinationColumnId]: { ...destinationColumn, tasks: destinationTasks },
      });
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            RND Team Sprint 2
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            {["All", "Task", "Bug", "Live issue", "Low priority"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FiUser className="text-gray-800 dark:text-gray-100 cursor-pointer" size={24} />
          <FiSettings className="text-gray-800 dark:text-gray-100 cursor-pointer" size={24} />
          <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <FiPlus className="mr-2" /> New Board
          </button>
        </div>
      </div>

      {/* Columns */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <DroppableColumn
              key={columnId}
              id={columnId}
              name={column.name}
              tasks={column.tasks}
              onCommentClick={handleCommentClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-4 bg-gray-300 rounded shadow-md">
              {
                Object.values(columns)
                  .flatMap((column) => column.tasks)
                  .find((task) => task.id === activeId)?.title
              }
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        taskId={selectedTask?.id}
        taskTitle={selectedTask?.title}
      />
    </div>
  );
};

export default ScrumBoard;