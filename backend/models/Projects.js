const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    githubUrl: {
      type: String,
    },

    language: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    review: {
      type: String,
      default: "",
    },

    reviewStatus: {
      type: String,
      default: "Pending",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
    readme: {
      type: String,
      default: "",
    },
    reviewHistory: [
    {
        review: {
            type: String
        },
        reviewedAt: {
            type: Date
        }
    }
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);