const mongoose = require('mongoose');
const highlightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  coverImage: { type: String }, // صورة الغلاف (تقدر تكون أول Story أو صورة مخصصة)
  stories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Story" }
  ],
  archivedStories: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId }, // Original Story ID
      text: { type: String },
      Photo: { type: Array },
      originalStory: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
      createdAt: { type: Date }
    }
  ],
}, {
  timestamps: true
});

const Highlight = mongoose.model("Highlight", highlightSchema);

module.exports = Highlight;