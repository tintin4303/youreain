// models/Apartment.js
import mongoose from "mongoose";

const ApartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, default: null },
  bedrooms: { type: Number, default: null },
  bathrooms: { type: Number, default: null },
  propertyType: { type: String, required: true },
  furnished: { type: String, required: true },
  images: { type: [String], required: true },
  available: { type: Boolean, default: true },
  campusVan: { type: String, default: null },
  mapUrl: { type: String, default: null },
  kitchen: { type: String, default: null },
  gym: { type: String, default: null },
  swimmingPool: { type: String, default: null },
  electricityRate: { type: Number, required: true },
}, { timestamps: true });


ApartmentSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

export default mongoose.models.Apartment || mongoose.model("Apartment", ApartmentSchema);