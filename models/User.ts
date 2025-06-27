import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
)

export const User = mongoose.models.User || mongoose.model("User", UserSchema, 'users')
