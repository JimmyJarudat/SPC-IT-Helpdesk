import React, { useState } from 'react';
import { FiAlertTriangle, FiPlus, FiEdit2, FiTrash2, FiBarChart, FiShield, FiActivity } from 'react-icons/fi';

const RiskSection = ({ selectedProject, formatDate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // รูปแบบการคำนวณระดับความเสี่ยง
  const getRiskLevel = (probability, impact) => {
    const levels = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };
    const score = levels[probability] * levels[impact];
    
    if (score >= 6) return {
      label: 'Critical',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-800'
    };
    if (score >= 4) return {
      label: 'High',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      borderColor: 'border-orange-200 dark:border-orange-800'
    };
    if (score >= 2) return {
      label: 'Medium',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    };
    return {
      label: 'Low',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      borderColor: 'border-green-200 dark:border-green-800'
    };
  };

  const handleAddRisk = (formData) => {
    // TODO: Implement add risk logic
    console.log('Adding new risk:', formData);
    setShowAddForm(false);
  };

  const handleEditRisk = (id, formData) => {
    // TODO: Implement edit risk logic
    console.log('Editing risk:', id, formData);
    setEditingId(null);
  };

  const handleDeleteRisk = (id) => {
    // TODO: Implement delete risk logic
    console.log('Deleting risk:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FiAlertTriangle className="text-red-500" />
          Risk Assessment
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiPlus className="w-5 h-5" />
          Add Risk
        </button>
      </div>

      {/* Risks Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiBarChart className="text-red-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Risk Level</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedProject?.risks?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Total Identified Risks</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiShield className="text-green-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Mitigation</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedProject?.risks?.filter(r => r.mitigation)?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Risks with Mitigation Plans</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiActivity className="text-yellow-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Active Monitoring</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedProject?.risks?.filter(r => r.status === 'Active')?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Risks Under Active Monitoring</p>
        </div>
      </div>

      {/* Risk Form (Add/Edit) */}
      {(showAddForm || editingId) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            {editingId ? 'Edit Risk' : 'Add New Risk'}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Description
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Describe the potential risk"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Probability
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-red-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Impact
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-red-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mitigation Strategy
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Describe how to mitigate this risk"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId ? handleEditRisk(editingId) : handleAddRisk()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Risk'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risks List */}
      <div className="space-y-4">
        {selectedProject?.risks?.map((risk, index) => {
          const riskLevel = getRiskLevel(risk.probability, risk.impact);
          return (
            <div
              key={risk.id || index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 ${riskLevel.borderColor} shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskLevel.color}`}>
                      {riskLevel.label} Risk Level
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {risk.description}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Probability:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${risk.probability === 'High' ? 'bg-red-100 text-red-800' :
                          risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {risk.probability}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Impact:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                          risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {risk.impact}
                      </span>
                    </div>
                  </div>

                  {risk.mitigation && (
                    <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mitigation Strategy:</p>
                      <p className="text-gray-700 dark:text-gray-300">{risk.mitigation}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start gap-2 ml-4">
                  <button
                    onClick={() => setEditingId(risk.id)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRisk(risk.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {(!selectedProject?.risks || selectedProject.risks.length === 0) && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FiAlertTriangle className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No risks identified yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
            >
              <FiPlus />
              Add First Risk
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskSection;