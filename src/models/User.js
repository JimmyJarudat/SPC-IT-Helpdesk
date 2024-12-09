import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String},
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
    department: { type: String},
    email: {
      type: String,
      unique: true,
      match: [/.+@.+\..+/, 'Invalid email format'] // ตรวจสอบรูปแบบอีเมล
    },
    employeeID: { type: String },
    nickName: { type: String},
    phone: { type: String},
    profileImage: { type: String, },
    computerName: { type: String, },
    position: { type: String, },
    department: { type: String, },
    division: { type: String, },
    location: { type: String, },


  },
  { timestamps: true }

);


export default mongoose.models.User || mongoose.model('User', UserSchema);
