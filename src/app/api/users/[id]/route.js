import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const user = await User.findById(params.id).lean();
    if (!user) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] failed:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const user = await User.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!user) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/[id] failed:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await User.findByIdAndDelete(params.id);
    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/users/[id] failed:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}