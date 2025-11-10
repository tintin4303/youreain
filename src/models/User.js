// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true 
    },
    name: { 
      type: String, 
      trim: true 
    },
    avatar: { 
      type: String 
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    // NEW: Store favorite apartment IDs
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
  },
  { 
    timestamps: true 
  }
);

// Indexes for performance
userSchema.index({ clerkId: 1 });
userSchema.index({ favorites: 1 }); // For fast lookup of users with favorites

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;