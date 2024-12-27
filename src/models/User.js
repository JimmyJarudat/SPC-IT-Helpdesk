import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'], // จำกัดค่า role
      default: 'user'
    },
    role_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // จำกัดค่า role_status
      default: 'pending'
    },
    company: { type: String },
    department: { type: String },
    email: { type: String, },
    employeeID: { type: String },
    nickName: { type: String },
    phone: { type: String },
    profileImage: { type: String, },
    computerName: { type: String, },
    position: { type: String, },
    department: { type: String, },
    division: { type: String, },
    location: { type: String, },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLogin: {
      type: Date,
    },
    
    lastLogin: { type: Date },
    lastOffline: { type: Date },
    online: {
      type: Boolean,
      default: false // กำหนดสถานะเริ่มต้นเป็นออฟไลน์
    },
    lastActivityTime: {
      type: Date,
      default: Date.now // บันทึกเวลาที่ผู้ใช้ทำกิจกรรมล่าสุด
    },
     // แยก log สำหรับ API
     activityLogAPI: [{
      url: { type: String, required: true },
      method: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      action: { type: String, required: true }
    }],
    // เพิ่ม log สำหรับการเข้าถึงหน้า
    activityLogPage: [{
      url: { type: String, required: true },
      method: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      action: { type: String, required: true }
    }]
    
    
  

  },
  { timestamps: true }

);


export default mongoose.models.User || mongoose.model('User', UserSchema);
