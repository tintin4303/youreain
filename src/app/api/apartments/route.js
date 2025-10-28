// app/api/apartments/route.js
import dbConnect from '../../../lib/mongodb';
import Apartment from '../../../models/Apartment';

export async function GET() {
  try {
    await dbConnect();
    const apartments = await Apartment.find({ available: true }).sort({ price: 1 });
    return Response.json(aptments);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const apartment = new Apartment(body);
    await apartment.save();
    return Response.json(apartment, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to add apartment' }, { status: 500 });
  }
}