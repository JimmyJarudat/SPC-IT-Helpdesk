import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  role_status: { type: String, default: 'pending' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
