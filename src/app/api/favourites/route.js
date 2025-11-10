// app/api/favorites/route.js
import { auth } from "@clerk/nextjs/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Apartment from "../../../models/Apartment";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { apartmentId } = body;
    if (!apartmentId || typeof apartmentId !== "string") {
      return Response.json({ error: "Invalid apartmentId" }, { status: 400 });
    }

    // Use .lean() to avoid Mongoose document issues
    let user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      const newUser = new User({ clerkId: userId, email: "", favorites: [] });
      await newUser.save();
      user = newUser.toObject();
    }

    const isCurrentlyFavorited = Array.isArray(user.favorites)
      ? user.favorites.some(id => id.toString() === apartmentId)
      : false;

    if (isCurrentlyFavorited) {
      await User.updateOne(
        { _id: user._id },
        { $pull: { favorites: apartmentId } }
      );
      await Apartment.updateOne(
        { _id: apartmentId },
        { $pull: { favoritedBy: user._id } }
      );
    } else {
      await User.updateOne(
        { _id: user._id },
        { $addToSet: { favorites: apartmentId } }
      );
      await Apartment.updateOne(
        { _id: apartmentId },
        { $addToSet: { favoritedBy: user._id } }
      );
    }

    return Response.json({ isFavorited: !isCurrentlyFavorited });
  } catch (error) {
    console.error("Favorites POST error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: userId })
      .populate("favorites")
      .lean();

    return Response.json(user?.favorites || []);
  } catch (error) {
    console.error("GET favorites error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}