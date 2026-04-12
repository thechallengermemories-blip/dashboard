import mongoose, { Schema, model, models } from 'mongoose';

const storySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  title: { type: String, required: true },
  narrative: { type: String, required: true },
  mission: { 
    type: String, 
    enum: ["challenger", "columbia"], 
    required: true 
  },
  imageUrl: { type: String },
  
  // High-level categorization
  category: { 
    type: String, 
    enum: ["public", "heritage"], 
    default: "public" 
  },

  // Specific sub-types
  relation: { 
    type: String, 
    enum: [
      "immediate-family", 
      "friend", 
      "colleague", 
      "public-observer"
    ],
    default: "public-observer"
  },

  // Verification
  isVerified: { 
    type: Boolean, 
    default: false 
  },

  // Featured Status
  isFeatured: { 
    type: Boolean, 
    default: false 
  },

  // Moderation
  status: {
    type: String,
    enum: ["pending", "published", "archived"],
    default: "pending"
  },

  createdAt: { type: Date, default: Date.now },
});

// This prevents Mongoose from creating the model multiple times during hot-reloading
const Story = models.stories || model('stories', storySchema);

export default Story;