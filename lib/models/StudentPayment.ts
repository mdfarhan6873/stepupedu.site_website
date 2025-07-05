import mongoose from 'mongoose';

const StudentPaymentSchema = new mongoose.Schema({
  mobileNo: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String },
  paymentDate: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'offline'], required: true },
  utrNo: { type: String },
  remark: { type: String }
}, { timestamps: true });

export default mongoose.models.StudentPayment || mongoose.model('StudentPayment', StudentPaymentSchema);
