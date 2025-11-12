// src/app/api/apartments/[id]/route.js
import dbConnect from '@/lib/mongodb';
import Apartment from '@/models/Apartment';
import { auth } from '@clerk/nextjs/server';

const cleanString = (val) => {
  if (typeof val === 'string') return val.trim() || null;
  return val == null ? null : val;
};

const cleanNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

export async function PUT(request, { params }) {
  try {
    await auth();
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // REQUIRED FIELDS ON UPDATE
    if (
      !body.title ||
      !body.price ||
      !body.location ||
      !body.propertyType ||
      !body.furnished ||
      !body.electricityRate ||
      !body.images || body.images.length === 0
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const electricityRate = cleanNumber(body.electricityRate);
    if (electricityRate === null) {
      return Response.json({ error: "Invalid electricity rate" }, { status: 400 });
    }

    const cleaned = {
      title: body.title,
      price: cleanNumber(body.price),
      location: body.location,
      description: cleanString(body.description),
      images: body.images,
      bedrooms: cleanNumber(body.bedrooms) ?? null,
      bathrooms: cleanNumber(body.bathrooms) ?? null,
      propertyType: body.propertyType,
      furnished: body.furnished,
      available: body.available ?? true,
      campusVan: cleanString(body.campusVan),
      mapUrl: cleanString(body.mapUrl),
      kitchen: cleanString(body.kitchen),
      gym: cleanString(body.gym),
      swimmingPool: cleanString(body.swimmingPool),
      electricityRate: electricityRate,
    };

    const apartment = await Apartment.findByIdAndUpdate(
      id,
      { $set: cleaned },
      { new: true, runValidators: true }
    );

    if (!apartment) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json(apartment);
  } catch (error) {
    console.error("PUT /api/apartments/[id] failed:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await auth();
    await dbConnect();
    const { id } = await params;

    const result = await Apartment.findByIdAndDelete(id);
    if (!result) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/apartments/[id] failed:", error);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}