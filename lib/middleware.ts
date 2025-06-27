import { User } from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

interface Data {
    email: string
    role: string
}

export const middleware = async (request: NextRequest) => {
    const token = request.headers.get("Authorization")
    if (!token) {
        return NextResponse.json({ message: "Access Denied" }, { status: 401 })
    }
    const decodedUser = jwt.verify(token, "DCBA") as Data

    const user = await User.findOne({
        email: decodedUser.email,
        role: decodedUser.role,
    })
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 401 })
    }
}
