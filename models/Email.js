import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    from: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    summary: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      index: true,
    },

    action_required: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
      index: true,
    },

    category: {
      type: String,
      enum: [
        "Security",
        "Work",
        "Marketing",
        "Spam",
        "Personal",
        "Finance",
        "Other",
      ],
      default: "Other",
      index: true,
    },

    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },

    deadline: {
      type: String,
    },

    is_meeting: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    important_entities: [
      {
        type: String,
        trim: true,
      },
    ],

    suggested_action: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Email || mongoose.model("Email", EmailSchema);
