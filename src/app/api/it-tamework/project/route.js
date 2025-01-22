import dbConnect from "@lib/dbConnect";
import Project from "@/models/Project";
import User from '@/models/User';
import mongoose from 'mongoose';
import { NextResponse } from "next/server";

// GET: ดึงข้อมูลโปรเจกต์
export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const search = searchParams.get("search") || "";
        const isUserSearch = searchParams.get("type") === "users"; // ตรวจสอบว่าค้นหา Users หรือไม่
        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const projectType = searchParams.get("projectType");
        const group = searchParams.get("group");
        const sortField = searchParams.get("sortField") || "createdAt";
        const sortOrder = searchParams.get("sort") === "asc" ? 1 : -1;



        // **กรณีค้นหา Users**
        // ตรวจสอบว่ากำลังค้นหา Users หรือไม่
        if (isUserSearch) {
            const userFilter = search
                ? {
                    $or: [
                        { fullName: { $regex: search, $options: "i" } },
                        { username: { $regex: search, $options: "i" } },
                        { nickName: { $regex: search, $options: "i" } },
                    ],
                }
                : {}; // ถ้าไม่มี search ส่งผลลัพธ์ทั้งหมด

            console.log("Search Filter:", userFilter);

            const users = await User.find(userFilter)
                .select("fullName username profileImage nickName")
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            console.log("Filtered users:", users);

            const totalUsers = await User.countDocuments(userFilter);

            return NextResponse.json({
                success: true,
                data: users,
                pagination: {
                    total: totalUsers,
                    page,
                    limit,
                    totalPages: Math.ceil(totalUsers / limit) || 1,
                },
            });
        }


        // **กรณีค้นหา Projects**
        const projectFilter = {};
        if (search) {
            projectFilter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }
        if (status) projectFilter.status = status;
        if (priority) projectFilter.priority = priority;
        if (projectType) projectFilter.projectType = projectType;
        if (group) projectFilter.group = group;

        const skip = (page - 1) * limit;

        const projects = await Project.find(projectFilter)
            .populate("members", "fullName profileImage username")
            .populate("createdBy", "fullName profileImage username")
            .populate("lastModifiedBy", "fullName profileImage username")
            .populate("tasks.assignee", "fullName profileImage username")
            .populate("notifications.userId", "fullName profileImage username")
            .populate("projectManager", "fullName profileImage username") // เพิ่มการ populate projectManager
            .populate('tasks.comments.user', 'fullName username profileImage')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalFiltered = await Project.countDocuments(projectFilter);

        projects.forEach((project) => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks = project.tasks?.filter((task) => task.status === "Completed").length || 0;
            project.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        });

        return NextResponse.json({
            success: true,
            data: projects,
            pagination: {
                total: totalFiltered,
                page,
                limit,
                totalPages: Math.ceil(totalFiltered / limit) || 1,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}


// POST: สร้างโปรเจกต์ใหม่
export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Enhanced validation
        if (!body.name?.trim()) {
            return NextResponse.json(
                { success: false, message: "Project name is required" },
                { status: 400 }
            );
        }
        if (!body.group?.trim()) {
            return NextResponse.json(
                { success: false, message: "Group is required" },
                { status: 400 }
            );
        }
        if (!body.createdBy) {
            return NextResponse.json(
                { success: false, message: "Created by is required" },
                { status: 400 }
            );
        }
        if (Array.isArray(body.members)) {
            body.members = body.members.map(id => new mongoose.Types.ObjectId(id));
        } else {
            body.members = []; // Set default empty array if no members
        }

        

        // เพิ่มการตรวจสอบ projectManager
        if (body.projectManager) {
            body.projectManager = new mongoose.Types.ObjectId(body.projectManager);
        }

        // Validate and convert dates
        if (body.startDate) body.startDate = new Date(body.startDate);
        if (body.endDate) body.endDate = new Date(body.endDate);

        // Convert member IDs to ObjectId
        body.members = body.members.map(id => new mongoose.Types.ObjectId(id));
        body.createdBy = new mongoose.Types.ObjectId(body.createdBy);

        // Validate and convert milestones and risks
        if (body.milestones) {
            body.milestones = body.milestones.map(milestone => ({
                ...milestone,
                dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
            }));
        }

        const newProject = new Project(body);
        await newProject.save();

        const populatedProject = await Project.findById(newProject._id)
            .populate("members", "fullName profileImage username")
            .populate("createdBy", "fullName profileImage username");

        return NextResponse.json({
            success: true,
            message: "Project created successfully!",
            data: populatedProject,
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal server error",
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}


// PUT: อัปเดตข้อมูลโปรเจกต์
export async function PUT(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();

        // อัปเดตเวลาแก้ไขล่าสุด
        body.lastModifiedAt = new Date();

        // แปลงค่า milestones และ risks
        if (body.milestones) {
            body.milestones = body.milestones.map(milestone => ({
                ...milestone,
                dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
            }));
        }

        // แก้ไขในส่วน PUT
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("members", "fullName profileImage username")
            .populate("createdBy", "fullName profileImage username")
            .populate("lastModifiedBy", "fullName profileImage username")
            .populate("tasks.assignee", "fullName profileImage username")
            .populate("notifications.userId", "fullName profileImage username")
            .populate("members", "fullName profileImage username")
            .populate("createdBy", "fullName profileImage username")
            .populate("lastModifiedBy", "fullName profileImage username")
            .populate("tasks.assignee", "fullName profileImage username")
            .populate("notifications.userId", "fullName profileImage username")
            .populate("projectManager", "fullName profileImage username"); // เพิ่มการ populate projectManager

        if (!updatedProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        // อัปเดต progress ใหม่
        const totalTasks = updatedProject.tasks?.length || 0;
        const completedTasks = updatedProject.tasks?.filter((task) => task.status === "Completed").length || 0;
        updatedProject.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // บันทึก progress ที่อัปเดตกลับไปยังฐานข้อมูล
        await updatedProject.save();

        return NextResponse.json({
            success: true,
            message: "Project updated successfully!",
            data: updatedProject,
        });

    } catch (error) {
        console.error("Error updating project:", error.message);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE: ลบโปรเจกต์
export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully!",
            data: deletedProject,
        });
    } catch (error) {
        console.error("Error deleting project:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}