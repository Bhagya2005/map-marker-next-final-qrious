import mongoose from 'mongoose';

const walkthroughSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    points: [
      {
        lat: Number,
        lng: Number,
        title: String,
        description: String,
      },
    ],
    videoUrl: {
      type: String,
    },
    duration: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Walkthrough || mongoose.model('Walkthrough', walkthroughSchema);
