import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const clerkId = url.searchParams.get("clerkId");

    if (clerkId) {
      const user = await User.findOne({ clerkId }).lean();
      if (!user) return Response.json(null, { status: 200 });
      return Response.json(user, { status: 200 });
    }

    // return all users (be careful in production; you may want auth)
    const users = await User.find().limit(100).lean();
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { clerkId, email } = body;
    if (!clerkId || !email) {
      return Response.json({ error: "Missing clerkId or email" }, { status: 400 });
    }

    // upsert: if user exists, return it
    let user = await User.findOne({ clerkId });
    if (user) {
      return Response.json(user, { status: 200 });
    }

    user = new User(body);
    await user.save();
    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}