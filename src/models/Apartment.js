// models/Apartment.js
import mongoose from 'mongoose';

// Validator: at least 1 image
function arrayLimit(val) {
  return val && val.length > 0;
}

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
    type: [String], // ← ARRAY OF STRINGS (URLs)
    required: true,
    validate: {
      validator: arrayLimit,
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
  owner: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes
apartmentSchema.index({ title: 'text', location: 'text' });
apartmentSchema.index({ available: 1, price: 1 });

// Export
const Apartment = mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);
export default Apartment;