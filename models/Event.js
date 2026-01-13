import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    'image-path': {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    audience: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      required: true,
    },
    agenda: {
      type: String,
    },
    organizer: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
