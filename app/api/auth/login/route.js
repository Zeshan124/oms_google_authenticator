import { NextResponse } from "next/server";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://boms.qistbazaar.pk/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    console.log("Attempting login for username:", username);

    const response = await axiosInstance.post("/user/login", {
      username,
      password,
    });

    console.log("Login response status:", response.status);
    console.log("Login response data:", response.data);

    const data = response.data;

    if (response.status === 200 && data) {
      const userData = {
        username: data.userName || data.username,
        email: data.email || data.userName || data.username,
        name: data.name || data.userName || data.username,
        userId: data.userId,
        role: data.role,
        roleID: data.roleID,
        branchID: data.branchID,
        branchName: data.branchName,
        branchCode: data.branchCode,
        branchCodeAlias: data.branchCodeAlias,
        storeBranch: data.storeBranch,
        ...data, // Include all other properties
      };

      const needs2FASetup = true;

      const responseData = {
        success: true,
        needs2FASetup,
        message: "Login successful. Please setup 2FA.",
      };

      const nextResponse = NextResponse.json(responseData);

      nextResponse.cookies.set("authToken", data.token, {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      nextResponse.cookies.set("userData", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return nextResponse;
    } else {
      console.error(
        "Login failed with status:",
        response.status,
        "data:",
        data
      );
      return NextResponse.json(
        { error: data.message || data.error || "Login failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);

      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Login failed",
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      return NextResponse.json(
        { error: "No response from server. Please check your connection." },
        { status: 503 }
      );
    } else {
      console.error("Error setting up request:", error.message);
      return NextResponse.json(
        { error: "Failed to connect to server" },
        { status: 500 }
      );
    }
  }
}