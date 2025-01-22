import React, { useState } from 'react';
import {
    FiX, FiFolder, FiCalendar, FiDollarSign, FiTag,
    FiUsers, FiAlertCircle, FiCheck, FiPlus
} from 'react-icons/fi';
import Select from 'react-select';
import { useUser } from "@/contexts/UserContext";


const CreateProjectModal = ({
    isOpen,
    onClose,
    onSubmit,
    availableMembers,
    isLoading,
    userSearch,
    setUserSearch
}) => {

    const { user } = useUser();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        group: '',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        budget: '',
        members: [],
        tags: '',
        status: 'Active',
        progress: 0,
        tasks: [],
        milestones: [],
        risks: [],
        attachments: [],
        createdBy: user.id
    });

    const [errors, setErrors] = useState({});

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.name.trim()) newErrors.name = 'Project name is required';
                if (!formData.group.trim()) newErrors.group = 'Group is required';
                if (!formData.description.trim()) newErrors.description = 'Description is required';
                break;

            case 2:
                if (!formData.startDate) newErrors.startDate = 'Start date is required';
                if (!formData.endDate) newErrors.endDate = 'End date is required';
                if (formData.startDate && formData.endDate &&
                    new Date(formData.startDate) > new Date(formData.endDate)) {
                    newErrors.endDate = 'End date must be after start date';
                }
                if (!formData.budget) newErrors.budget = 'Budget is required';
                break;

            case 3:
                if (formData.members.length === 0) {
                    newErrors.members = 'กรุณาเลือกสมาชิกอย่างน้อย 1 คน';
                }
                break;




        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isSubmitButton = e.nativeEvent.submitter?.type === 'submit';

        // ถ้ายังไม่อยู่ในขั้นตอนสุดท้าย และไม่ได้กด submit ให้ไปยังขั้นตอนถัดไป
        if (currentStep < 3 && !isSubmitButton) {
            handleNext();
            return;
        }

        // ถ้าอยู่ในขั้นตอนที่ 3 และเป็นการ submit จริงๆ
        if (currentStep === 3 && isSubmitButton) {
            if (!validateStep(3)) {
                return; // หยุดการทำงานหากตรวจสอบไม่ผ่าน
            }

            try {
                const submissionData = {
                    ...formData,
                    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                    budget: parseFloat(formData.budget),
                    members: formData.members || [],
                };

                await onSubmit(submissionData);

                // รีเซ็ตข้อมูลหลังการบันทึก
                setFormData({
                    name: '',
                    description: '',
                    group: '',
                    priority: 'Medium',
                    startDate: '',
                    endDate: '',
                    budget: '',
                    members: [],
                    tags: '',
                    status: 'Active',
                    progress: 0,
                    tasks: [],
                    milestones: [],
                    risks: [],
                    attachments: [],
                    createdBy: user.id,
                });

                setCurrentStep(1);
                onClose();
            } catch (error) {
                console.error('Error submitting project:', error);
                setErrors((prev) => ({
                    ...prev,
                    submit: 'Failed to create project. Please try again.',
                }));
            }
        }
    };



    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${currentStep === step
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : currentStep > step
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-gray-300 text-gray-500'
                        }`}
                    >
                        {currentStep > step ? <FiCheck /> : step}
                    </div>
                    {step < 3 && (
                        <div className={`w-20 h-0.5 ${currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Project Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                        } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter project name"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle /> {errors.name}
                    </p>
                )}
            </div>

            {/* Group */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Group *
                </label>
                <div className="relative">
                    <FiFolder className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={formData.group}
                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.group ? 'border-red-500' : 'border-gray-300'
                            } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter group name"
                    />
                </div>
                {errors.group && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle /> {errors.group}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'
                        } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter project description"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle /> {errors.description}
                    </p>
                )}
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                </label>
                <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter tags separated by commas"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Separate tags with commas (e.g., Web App, React, MongoDB)
                </p>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date *
                    </label>
                    <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    {errors.startDate && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.startDate}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date *
                    </label>
                    <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    {errors.endDate && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.endDate}
                        </p>
                    )}
                </div>
            </div>

            {/* Budget */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget *
                </label>
                <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.budget ? 'border-red-500' : 'border-gray-300'
                            } dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter project budget"
                    />
                </div>
                {errors.budget && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle /> {errors.budget}
                    </p>
                )}
            </div>

            {/* Priority */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                </label>
                <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Team Members */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Team Members
                </label>
                <div className="relative">
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <Select
                        isMulti
                        options={availableMembers}
                        value={availableMembers.filter(member =>
                            formData.members.includes(member.value)
                        )}
                        onChange={(selectedOptions) => {
                            setFormData(prev => ({
                                ...prev,
                                members: selectedOptions ? selectedOptions.map(option => option.value) : []
                            }));
                        }}
                        onInputChange={(newValue) => {
                            setUserSearch(newValue);
                        }}
                        placeholder="Search and select team members"
                        className={`pl-8 ${errors.members ? 'select-error' : ''}`}
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                paddingLeft: '2rem',
                                borderColor: errors.members ? 'rgb(239, 68, 68)' : base.borderColor
                            }),
                            container: (base) => ({
                                ...base,
                                zIndex: 50
                            })
                        }}
                        components={{
                            Option: ({ data, innerProps, ...props }) => (
                                <div
                                    {...innerProps}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <img
                                        src={data.profileImage || `/api/profile/getImage/${data.username || 'placeholder'}.jpg`}
                                        alt={data.label}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span>{data.label}</span>
                                </div>
                            )
                        }}
                    />
                </div>
                {errors.members && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle /> {errors.members}
                    </p>
                )}
            </div>

            {/* Project Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Project Summary
                </h4>
                <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {formData.name}</p>
                    <p><span className="font-medium">Group:</span> {formData.group}</p>
                    <p><span className="font-medium">Timeline:</span> {formData.startDate} to {formData.endDate}</p>
                    <p><span className="font-medium">Budget:</span> ${formData.budget}</p>
                    <p><span className="font-medium">Priority:</span> {formData.priority}</p>
                    <p><span className="font-medium">Team Size:</span> {formData.members.length} members</p>
                    {formData.tags && (
                        <p><span className="font-medium">Tags:</span> {formData.tags}</p>
                    )}
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl">
                {/* Header */}
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            Create New Project
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Steps Indicator */}
                <div className="px-6 pt-6">
                    {renderStepIndicator()}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="contents">
                    <div className="p-6">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 
                      ${currentStep === 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                Back
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck />
                                                Create Project
                                            </>
                                        )}
                                    </button>
                                )}

                            </div>
                        </div>
                        {errors.submit && (
                            <p className="mt-2 text-sm text-red-500 text-center">
                                {errors.submit}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;