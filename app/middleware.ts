import { User } from "@/models/User"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'

interface Data {
    email: string,
    role: string
}

export const middleware = async (request: NextRequest) => {
    console.log("rednered")
    try {
        const token = request.headers.get("Authorization")
        if (token) {
            console.log("rednered error", token)
            return NextResponse.json({ message: "Unauthorized user" }, { status: 401 })
        }
        const DecodedUser = jwt.verify(token as string, "DCBA") as Data
        const user = await User.findOne({
            email: DecodedUser.email,
            role: DecodedUser.role,
        })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 })
        }
    } catch {
        return NextResponse.json({ message: "Access Denied" }, { status: 401 })
    }
}