import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    category: {
      type: String,
      enum: ['bug', 'feature', 'improvement', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
