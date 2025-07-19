// File: /app/api/Contacts/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Contact from "@/models/Contact";
import mongoose from "mongoose";

// GET /api/Contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Next.js 15 requires Promise
) {
  try {
    await dbConnect();
    const { id } = await params; // ✅ cần await

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 });
    }

    const contact = await Contact.findById(id).lean();

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

// PUT /api/Contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ phải là Promise
) {
  try {
    const { id } = await params; // ✅ await Promise

    const body = await request.json();
    const { name, email, phone, group } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 });
    }

    await dbConnect();

    // Kiểm tra trùng email
    const existingContact = await Contact.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: id },
    });

    if (existingContact) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      group: group?.trim() || undefined,
    };

    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error: any) {
    console.error("Error updating contact:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    // Duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// DELETE /api/Contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Next 15: Promise
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 });
    }

    await dbConnect();

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
