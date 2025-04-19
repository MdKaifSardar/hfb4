"use server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"



import { revalidatePath } from "next/cache"

// Mock user database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "professor",
  },
]

// Mock function to create a user
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User already exists with this email.")
    }

    const newUser: IUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password, // ⚠️ Should hash this before saving in production
      role: userData.role,
      createdAt: new Date(),
    })

    return {
      id: newUser.id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function signIn(credentials: { email: string; password: string }) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email: credentials.email })

    if (!user) {
      throw new Error("User not found")
    }

    // In production: use bcrypt.compare()
    if (user.password !== credentials.password) {
      throw new Error("Incorrect password")
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    throw new Error("Invalid email or password")
  }
}



