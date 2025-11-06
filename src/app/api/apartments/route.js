// app/api/apartments/route.js
import dbConnect from '../../../lib/mongodb';
import Apartment from '../../../models/Apartment';

export async function GET() {
  try {
    await dbConnect();
    const apartments = await Apartment.find({ available: true }).sort({ price: 1 });
    return Response.json(apartments);
  } catch (error) {
    console.error("GET /api/apartments failed:", error);
    return Response.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // VALIDATE REQUIRED FIELDS
    const { title, price, location, images } = body;
    if (!title || !price || !location || !Array.isArray(images) || images.length === 0) {
      return Response.json({ error: 'Missing required fields or invalid images' }, { status: 400 });
    }

    const apartment = new Apartment(body);
    await apartment.save();
    return Response.json(apartment, { status: 201 });
  } catch (error) {
    console.error("POST /api/apartments failed:", error);
    return Response.json({ error: 'Failed to add apartment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await Apartment.findByIdAndDelete(params.id);
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}