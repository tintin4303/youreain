// src/app/api/apartments/route.js
import dbConnect from '@/lib/mongodb';
import Apartment from '@/models/Apartment';

const cleanString = (val) => {
  if (typeof val === 'string') return val.trim() || null;
  return val == null ? null : val;
};

const cleanNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    const query = admin ? {} : { available: true };
    const apartments = await Apartment.find(query).sort({ createdAt: -1 });
    return Response.json(apartments);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // REQUIRED FIELD VALIDATION
    if (
      !body.title ||
      !body.price ||
      !body.location ||
      !body.propertyType ||
      !body.furnished ||
      !body.electricityRate ||
      !body.images ||
      body.images.length === 0
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- use module-level cleaners, don't redeclare them ---
    const apartmentData = {
      title: cleanString(body.title),
      price: cleanNumber(body.price),
      location: cleanString(body.location),
      description: cleanString(body.description),
      bedrooms: cleanNumber(body.bedrooms),
      bathrooms: cleanNumber(body.bathrooms),
      propertyType: cleanString(body.propertyType),
      furnished: cleanString(body.furnished),
      available: body.available ?? true,
      images: Array.isArray(body.images) ? body.images : [],
      campusVan: cleanString(body.campusVan),
      mapUrl: cleanString(body.mapUrl),
      kitchen: cleanString(body.kitchen),
      gym: cleanString(body.gym),
      swimmingPool: cleanString(body.swimmingPool),
      electricityRate: cleanNumber(body.electricityRate),
    };

    // ensure nulls
    Object.keys(apartmentData).forEach((key) => {
      if (apartmentData[key] === undefined) apartmentData[key] = null;
    });

    const apartment = new Apartment(apartmentData);
    await apartment.save();

    return Response.json(apartment, { status: 201 });
  } catch (error) {
    console.error("POST failed:", error);
    return Response.json({ error: "Save failed" }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...update } = body;

    if (!_id) return Response.json({ error: "ID required" }, { status: 400 });

    if (
      !update.title ||
      !update.price ||
      !update.location ||
      !update.propertyType ||
      !update.furnished ||
      !update.electricityRate ||
      !update.images || update.images.length === 0
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleaned = {
      title: update.title,
      price: cleanNumber(update.price),
      location: update.location,
      description: cleanString(update.description),
      images: update.images,
      bedrooms: cleanNumber(update.bedrooms) ?? null,
      bathrooms: cleanNumber(update.bathrooms) ?? null,
      propertyType: update.propertyType,
      furnished: update.furnished,
      available: update.available ?? true,
      campusVan: cleanString(update.campusVan),
      mapUrl: cleanString(update.mapUrl),
      kitchen: cleanString(update.kitchen),
      gym: cleanString(update.gym),
      swimmingPool: cleanString(update.swimmingPool),
      electricityRate: cleanNumber(update.electricityRate),
    };

    const apartment = await Apartment.findByIdAndUpdate(_id, { $set: cleaned }, { new: true });
    if (!apartment) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json(apartment);
  } catch (error) {
    console.error("PUT failed:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: "ID required" }, { status: 400 });
    await Apartment.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}