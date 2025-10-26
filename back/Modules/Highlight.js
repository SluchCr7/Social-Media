const highlightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  coverImage: { type: String }, // صورة الغلاف (تقدر تكون أول Story أو صورة مخصصة)
  stories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Story" }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Highlight = mongoose.model("Highlight", highlightSchema);

module.exports = Highlight;