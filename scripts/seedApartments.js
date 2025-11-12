// scripts/seedApartments.js
import 'dotenv/config';
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
    available: true,
    propertyType: "1 Bedroom",
    furnished: "Yes",
    owner: "admin@youreain.com",
    favoritedBy: [],
    campusVan: "5 min walk to ABAC",
    mapUrl: "https://maps.app.goo.gl/d6eBkjAjLgYjTar58",
    kitchen: "Gas stove, microwave, fridge",
    gym: "24/7 gym, weights, treadmill",
    swimmingPool: "Rooftop pool, 25m",
    electricityRate: 4.5,
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
    available: true,
    propertyType: "2 Bedrooms",
    furnished: "Yes",
    owner: "admin@youreain.com",
    favoritedBy: [],
    campusVan: "Free van to BTS",
    mapUrl: "https://maps.app.goo.gl/xyz789",
    kitchen: "Full kitchen, oven, dishwasher",
    gym: "Fitness center, yoga studio",
    swimmingPool: "Infinity pool, jacuzzi",
    electricityRate: 5.0,
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
    available: true,
    propertyType: "Studio",
    furnished: "Yes",
    owner: "admin@youreain.com",
    favoritedBy: [],
    campusVan: "10 min to campus",
    mapUrl: "https://maps.app.goo.gl/abc456",
    kitchen: "Compact kitchenette, fridge",
    gym: "Shared gym, cardio machines",
    swimmingPool: "Outdoor pool",
    electricityRate: 4.2,
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
    available: true,
    propertyType: "1 Bedroom",
    furnished: "No",
    owner: "admin@youreain.com",
    favoritedBy: [],
    campusVan: "Shuttle to Chula",
    mapUrl: "https://maps.app.goo.gl/def789",
    kitchen: "Full kitchen, granite counters",
    gym: "State-of-the-art gym, sauna",
    swimmingPool: "Rooftop infinity pool",
    electricityRate: 5.5,
  }
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    await Apartment.deleteMany({});
    console.log("Cleared old apartments");

    const apartments = DUMMY_APARTMENTS.map(apartment => ({
      ...apartment,
      _id: new mongoose.Types.ObjectId()
    }));

    await Apartment.insertMany(apartments);
    console.log(`${apartments.length} apartments seeded!`);

    await mongoose.connection.close();
    console.log("DB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();