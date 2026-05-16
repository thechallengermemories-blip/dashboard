import mongoose, { Schema } from 'mongoose';

const storySchema = new Schema({
  name:      { type: String, required: true },
  email:     { type: String },
  title:     { type: String, required: true },
  narrative: { type: String, required: true },
  mission:   { type: String, enum: ["challenger", "columbia"], required: true },
  imageUrl:  { type: String },

  // ✅ was missing — Mongoose strict mode strips unknown fields on read
  media: [
    {
      url:  { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true },
    },
  ],

  category: { type: String, enum: ["public", "heritage"], default: "public" },
  relation: {
    type: String,
    enum: ["immediate-family", "friend", "colleague", "public-observer"],
    default: "public-observer",
  },
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "published", "archived"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ was 'stories' — must match the main website's model name 'Story'
// so both apps talk to the same cached model and same collection
delete (mongoose.models as any).Story;
const Story = mongoose.model('Story', storySchema);

export default Story;