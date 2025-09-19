const mongoose = require("mongoose");
const ReelSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true, // رابط الفيديو أو التخزين السحابي
  },
  thumbnailUrl: {
    type: String,
    default: "", // صورة مصغرة للفيديو
  },
  caption: {
    type: String,
    default: "",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // صاحب الفيديو
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, {
  timestamps: true,
});

const Reel = mongoose.model("Reel", ReelSchema);

module.exports = Reel;