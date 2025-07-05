import mongoose from 'mongoose';

const TeacherPaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paidTo: { type: String, required: true },
  mobileNo: { type: String, required: true },
  month: { type: String, required: true },
  remark: { type: String },
  paymentDate: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'offline'], required: true },
  utrNo: { type: String }
}, { timestamps: true });

export default mongoose.models.TeacherPayment || mongoose.model('TeacherPayment', TeacherPaymentSchema);
