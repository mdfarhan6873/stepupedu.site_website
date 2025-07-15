import mongoose from 'mongoose';

const WhatsAppGroupSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, required: true },
  groupLink: { type: String, required: true },
  groupName: { type: String, required: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create compound index to ensure uniqueness of class-section combination
WhatsAppGroupSchema.index({ class: 1, section: 1 }, { unique: true });

export default mongoose.models.WhatsAppGroup || mongoose.model('WhatsAppGroup', WhatsAppGroupSchema);