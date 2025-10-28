import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: String, required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);


