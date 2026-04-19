import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [{ type: String }],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    estimatedHours: Number,
    actualHours: Number, 
    attachments: [String],
    dueDate: Date,
    relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project.tasks" }]
  },
  { timestamps: true }
);

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);