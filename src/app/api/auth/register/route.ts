import { NextRequest, NextResponse } from "next/server"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { message: error.message || "Registration failed" },
        { status: response.status }
      )
    }
    const user = await response.json()
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
