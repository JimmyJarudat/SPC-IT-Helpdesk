import React, { useState } from 'react';
import { 
  FiPaperclip, FiUploadCloud, FiFile, FiImage, FiFileText, 
  FiTrash2, FiDownload, FiEye, FiX, FiPlus
} from 'react-icons/fi';

const AttachmentsSection = ({ selectedProject, formatDate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return <FiImage className="w-8 h-8 text-blue-500" />;
      case 'application/pdf':
        return <FiFileText className="w-8 h-8 text-red-500" />;
      default:
        return <FiFile className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    // Implement file upload logic
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    // Implement file upload logic
  };

  const handleDelete = (attachmentId) => {
    console.log('Delete attachment:', attachmentId);
    // Implement delete logic
  };

  const attachments = selectedProject?.attachments || [];

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FiPaperclip className="text-blue-500" />
          Attachments
        </h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiUploadCloud className="w-5 h-5" />
          Upload Files
        </button>
      </div>

      {/* Upload Area */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Upload Files</h4>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600'}`}
            >
              <FiUploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag and drop your files here, or
              </p>
              <label className="inline-block">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  Browse Files
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Maximum file size: 10MB
              </p>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Uploading...</span>
                  <span className="text-gray-600 dark:text-gray-300">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Files Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiFile className="text-blue-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Total Files</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {attachments.length}
          </p>
          <p className="text-sm text-gray-500">Uploaded Documents</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiImage className="text-green-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Images</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {attachments.filter(file => file.type?.startsWith('image/')).length}
          </p>
          <p className="text-sm text-gray-500">Image Files</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FiFileText className="text-yellow-500 w-5 h-5" />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Documents</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {attachments.filter(file => !file.type?.startsWith('image/')).length}
          </p>
          <p className="text-sm text-gray-500">Document Files</p>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {attachments.length > 0 ? (
          <div className="divide-y dark:divide-gray-700">
            {attachments.map((file, index) => (
              <div 
                key={file.id || index}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Uploaded {formatDate(file.uploadDate)}
                      </span>
                      {file.uploadedBy && (
                        <span className="text-xs text-gray-500">
                          by {file.uploadedBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="View"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Download"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete"
                      onClick={() => handleDelete(file.id)}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiPaperclip className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No attachments yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
            >
              <FiPlus />
              Add First Attachment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsSection;