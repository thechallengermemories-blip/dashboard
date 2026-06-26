import mongoose, { Schema } from 'mongoose';

const adminUserSchema = new Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true }, // bcrypt hash
  name:      { type: String, required: true },
  role:      { type: String, enum: ['super', 'editor'], default: 'editor' },
  createdAt: { type: Date, default: Date.now },
});

delete (mongoose.models as any).AdminUser;
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;