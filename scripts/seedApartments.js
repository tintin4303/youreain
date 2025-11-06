// scripts/seedApartments.js
import 'dotenv/config'; // ← ADD THIS LINE
import dbConnect from '../src/lib/mongodb.js';
import Apartment from '../src/models/Apartment.js';
import mongoose from 'mongoose';

const DUMMY_APARTMENTS = [
  {
    title: "D Condo 1 Bed",
    price: 8500,
    location: "Bang Na, near ABAC",
    images: [
      "https://res.cloudinary.com/demo/image/upload/samples/animals/cat.jpg",
      "https://res.cloudinary.com/demo/image/upload/samples/animals/dog.jpg",
      "https://res.cloudinary.com/demo/image/upload/samples/animals/rabbit.jpg"
    ],
    description: "Cozy 1-bedroom condo with modern furniture, 30 m². Near BTS, 7-Eleven, and food court.",
    bedrooms: 1,
    bathrooms: 1,
    size: 30,
    available: true
  },
  {
    title: "Lumpini Place 2 Bed",
    price: 18000,
    location: "Sukhumvit 101",
    images: [
      "https://res.cloudinary.com/demo/image/upload/samples/food/dessert.jpg",
      "https://res.cloudinary.com/demo/image/upload/samples/food/spices.jpg"
    ],
    description: "Spacious 2-bed with balcony, pool view. 60 m². Gym, pool, 24hr security.",
    bedrooms: 2,
    bathrooms: 1,
    size: 60,
    available: true
  },
  {
    title: "The Base Park West",
    price: 12000,
    location: "On Nut",
    images: [
      "https://res.cloudinary.com/demo/image/upload/samples/animals/three-dogs.jpg"
    ],
    description: "Studio near BTS On Nut. Fully furnished, high floor, city view.",
    bedrooms: 0,
    bathrooms: 1,
    size: 28,
    available: true
  },
  {
    title: "IDEO Q Chula",
    price: 22000,
    location: "Sathorn, near MRT",
    images: [
      "https://res.cloudinary.com/demo/image/upload/samples/people/bicycle.jpg",
      "https://res.cloudinary.com/demo/image/upload/samples/people/kitchen-bar.jpg"
    ],
    description: "Luxury 1-bed in prime location. 35 m². Rooftop pool, co-working space.",
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    available: true
  }
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    await Apartment.deleteMany({});
    console.log("Cleared old apartments");

    await Apartment.insertMany(DUMMY_APARTMENTS);
    console.log(`${DUMMY_APARTMENTS.length} dummy apartments seeded!`);

    await mongoose.connection.close();
    console.log("DB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();