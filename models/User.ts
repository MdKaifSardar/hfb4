// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: "user" | "professor"
    tokenBalance?: number
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "professor"], default: "user" },
    tokenBalance: { type: Number, default: 0 },
}, { collection: "users" });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
