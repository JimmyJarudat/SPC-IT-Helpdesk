import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
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
    company: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Invalid email format'] // ตรวจสอบรูปแบบอีเมล
    },
    employeeID: { type: String, required: true, unique: true },
    nickName: { type: String, trim: true },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Invalid phone number'], // ตัวอย่าง: เบอร์โทร 10 หลัก
      trim: true
    },
    profileImage: { type: String, },
  },
  { timestamps: true }
);


export default mongoose.models.User || mongoose.model('User', UserSchema);
