import React from 'react';
import { FiSearch, FiPlus, FiGrid, FiList } from 'react-icons/fi';

const ProjectListHeader = ({ 
  isGridView, 
  setIsGridView, 
  togglePopup,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Project List
      </h1>
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
          <FiSearch className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 bg-transparent outline-none text-gray-700 dark:text-gray-200 w-48"
          />
        </div>

        {/* View Toggle Button */}
        <button
          className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setIsGridView(!isGridView)}
        >
          {isGridView ? (
            <>
              <FiList className="mr-2" />
              List View
            </>
          ) : (
            <>
              <FiGrid className="mr-2" />
              Grid View
            </>
          )}
        </button>

        {/* New Project Button */}
        <button
          className="flex items-center px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
          onClick={togglePopup}
        >
          <FiPlus className="mr-2" />
          New Project
        </button>
      </div>
    </div>
  );
};

// PropTypes
ProjectListHeader.defaultProps = {
  searchQuery: '',
  isGridView: true
};

export default ProjectListHeader;