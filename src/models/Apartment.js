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
  images: [{
    type: String,
    required: true, // URLs to images (e.g., Cloudinary)
  }],
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
    type: Number, // sqm
    min: 0,
  },
  // For admin: owner info, created date
  owner: {
    type: String, // Owner name or ID
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

// Index for fast searches
apartmentSchema.index({ title: 'text', location: 'text' });
apartmentSchema.index({ available: 1, price: 1 });

const Apartment = mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);

export default Apartment;