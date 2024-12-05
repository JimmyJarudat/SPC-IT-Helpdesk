const mongoose = require('mongoose');

const ITJobSchema = new mongoose.Schema({
    jobID: { type: String, required: true }, // รหัสงาน
    createdAt: { type: Date, default: Date.now }, // วันที่สร้าง
    company: { type: String }, // บริษัท
    location: { type: String }, // สถานที่
    computerName: { type: String }, // ชื่อคอมพิวเตอร์
    position: { type: String }, // ตำแหน่ง
    fullName: { type: String, required: true }, // ชื่อเต็ม
    nickName: { type: String }, // ชื่อเล่น
    division: { type: String }, // แผนก
    department: { type: String }, // หน่วยงาน
    email: { type: String }, // อีเมล
    phoneNumber: { type: String }, // เบอร์โทร

    jobName: { type: String, required: true }, // ชื่องาน
    jobDescription: { type: String }, // รายละเอียดงาน
    category: { type: String }, // ประเภทงาน
    resolution_notes: { type: String }, // หมายเหตุการแก้ไข
    device_change_info: {
        oldDevice: { type: String }, // อุปกรณ์เดิม
        newDevice: { type: String }, // อุปกรณ์ใหม่
        replacementDate: { type: Date }, // วันที่เปลี่ยน
        reason: { type: String } // เหตุผล
    }, // รายละเอียดการเปลี่ยนอุปกรณ์
    tag: { type: String },

    nameJob_owner: { type: String }, // ชื่อผู้รับผิดชอบงาน
    nicknameJob_owner: { type: String }, // ชื่อเล่นผู้รับผิดชอบงาน
    emailJob_owner: { type: String }, // อีเมลผู้รับผิดชอบงาน
    phoneJob_owner: { type: String }, // เบอร์โทรผู้รับผิดชอบงาน
    dateAcepJob_owner: { type: Date }, // วันที่ยอมรับงาน

    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'completed_Late',], default: 'pending' }, // สถานะ
    processTime: { type: Number }, // เวลาที่ใช้ในการดำเนินการ (หน่วย: ชั่วโมง)
    completionDate: { type: Date }, // วันที่เสร็จสิ้น
    dueDate: { type: Date }, // กำหนดส่ง
    progress: { type: Number, min: 0, max: 100 } // ความคืบหน้า (เปอร์เซ็นต์)
},

    {
        collection: 'it-job', // Specify the collection name
        timestamps: true // Enable automatic timestamps
    });

module.exports = mongoose.model('ITJob', ITJobSchema);

// Export Model