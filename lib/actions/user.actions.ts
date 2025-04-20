"use server"

import {connectToDatabase} from "@/lib/database/mongodb"
import User, { IUser } from "@/lib/models/user.model"

export async function addTokensToUser(userId: string, tokenAmount: number) {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    user.tokens = (user.tokens || 0) + tokenAmount
    await user.save()

    return { message: "Tokens added successfully" }
  } catch (error) {
    console.error("Error adding tokens to user:", error)
    throw new Error("Failed to add tokens to user")
  }
}

// 1. Create User
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
      password: userData.password, // ⚠ hash in production!
      role: userData.role,
      createdAt: new Date(),
    })

    const userId = newUser.id.toString()

    // Save userId to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId)
    }

    return {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// 2. Sign In
export async function signIn(credentials: { email: string; password: string }) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email: credentials.email })
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password")
    }

    const userId = user._id.toString()

    // Save userId to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId)
    }

    return {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}
