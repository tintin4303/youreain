// models/Apartment.js
import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: 'Must have at least one image',
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 1,
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 1,
  },
  size: {
    type: Number,
    min: 0,
  },
  propertyType: {
    type: String, // Studio, 1BR, 2BR, etc.
    enum: ['Studio', '1 Bedroom', '2 Bedrooms', '3+ Bedrooms'],
  },
  furnished: {
    type: String, // Yes, No
    enum: ['Yes', 'No'],
  },
  owner: {
    type: String,
  },
  // NEW: Users who favorited this apartment
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Indexes
apartmentSchema.index({ title: 'text', location: 'text' });
apartmentSchema.index({ available: 1, price: 1 });
apartmentSchema.index({ favoritedBy: 1 });

export default mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);