import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Contact from "@/models/Contact"

export async function GET() {
  try {
    console.log("🔄 Fetching contacts...")
    await dbConnect()
    const contacts = await Contact.find({}).sort({ name: 1 }).lean()
    console.log("✅ Contacts fetched successfully:", contacts.length)
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("❌ Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Creating new contact...")

    const body = await request.json()
    console.log("📝 Request body:", body)

    const { name, email, phone, group } = body

    // Validation
    if (!name || !email) {
      console.log("❌ Validation failed: Missing name or email")
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    console.log("🔄 Connecting to database...")
    await dbConnect()

    // Check if email already exists
    console.log("🔄 Checking for existing email...")
    const existingContact = await Contact.findOne({ email: email.trim().toLowerCase() })
    if (existingContact) {
      console.log("❌ Email already exists:", email)
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    console.log("🔄 Creating contact document...")
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      group: group?.trim() || undefined,
    })

    console.log("🔄 Saving contact to database...")
    const savedContact = await contact.save()
    console.log("✅ Contact created successfully:", savedContact)

    return NextResponse.json(savedContact, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error creating contact:", error)
    console.error("❌ Error stack:", error.stack)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      console.log("❌ Mongoose validation errors:", validationErrors)
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      console.log("❌ Duplicate key error")
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Handle MongoDB connection errors
    if (error.name === "MongooseError" || error.name === "MongoError") {
      console.log("❌ MongoDB connection error")
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
