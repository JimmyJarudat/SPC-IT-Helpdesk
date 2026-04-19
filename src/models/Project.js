import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      description: { type: String },
      group: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      projectManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["Active", "Completed"], default: "Active" },
      tags: [{ type: String }],
      startDate: { type: Date },
      endDate: { type: Date },
      priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
      progress: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      projectType: { type: String, enum: ["Internal", "External", "Client-Based"], default: "Internal" },
      attachments: [{ type: String }],
      tasks: [
        {
          taskId: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String },
          status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
          assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          startDate: { type: Date },
          endDate: { type: Date },
          estimatedHours: Number,
          actualHours: Number,
          comments: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now }
          }],
          attachments: [String]
        },
      ],
      milestones: [{
        name: String,
        description: String, 
        dueDate: Date,
        completed: { type: Boolean, default: false }
      }],
      risks: [{
        description: String,
        probability: String, 
        impact: String,
        mitigation: String  
      }],
      notifications: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          message: { type: String },
          read: { type: Boolean, default: false },
          date: { type: Date, default: Date.now },
        },
      ],
      lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      lastModifiedAt: { type: Date, default: Date.now },
    },
    { timestamps: true, collection: "projects" }
);
  
export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);