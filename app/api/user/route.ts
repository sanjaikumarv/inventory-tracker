import { type NextRequest, NextResponse } from "next/server"
import { ensureConnection } from "@/lib/database"
import { User } from "@/models/User"
import jwt from "jsonwebtoken"

export async function GET() {
    try {
        await ensureConnection()
        const existingItem = await User.findOne({ role: "ADMIN" })
        if (existingItem) {
            return NextResponse.json({ message: "User already exists" })
        }
        const item = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: "123456",
            role: "ADMIN"
        })
        await item.save()
        return NextResponse.json({ message: "User added successfully", status: 201 })
    } catch (error) {
        console.error("Error creating item:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { email, password } = body
    try {
        await ensureConnection()
        const user = await User.findOne({ email: email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 })
        }
        if (user.password !== password) {
            return NextResponse.json({ message: "Passeord is wrong" }, { status: 401 })
        }
        const tokenData = {
            email: user.email,
            role: user.role,
        }
        const token = jwt.sign(tokenData, 'DCBA', {
            expiresIn: "1d"
        })
        return NextResponse.json({ message: "User added successfully", token: token, status: 201 })
    } catch (error) {
        console.error("Error creating item:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

