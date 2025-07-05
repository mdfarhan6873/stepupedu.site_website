import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  forAll: { type: Boolean, default: false },
  forRole: { type: String }, // 'student', 'teacher', or undefined
  mobileNo: { type: String }, // for specific user
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
