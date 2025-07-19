import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Contact from "@/models/Contact"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    const contact = await Contact.findById(params.id).lean()

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, group } = body

    // Validation
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    await dbConnect()

    // Check if email already exists for a different contact
    const existingContact = await Contact.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: params.id },
    })

    if (existingContact) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      group: group?.trim() || undefined,
    }

    const updatedContact = await Contact.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!updatedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact updated successfully", contact: updatedContact })
  } catch (error: any) {
    console.error("Error updating contact:", error)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
    }

    await dbConnect()

    const deletedContact = await Contact.findByIdAndDelete(params.id)

    if (!deletedContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }
}
