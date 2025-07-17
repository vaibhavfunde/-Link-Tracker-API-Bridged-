

import { cookies as getCookies } from "next/headers"; // ✅ Required to set cookie
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import User from "@/model/User";
import { connectToDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

   
    await connectToDatabase();

  


    if (!email || !password || !username) {
  return NextResponse.json({ error: "All fields are required" }, { status: 400 });
}

const existingUser = await User.findOne({ email });
if (existingUser) {
  return NextResponse.json({ error: "Email already exists" }, { status: 400 });
}

const existingUserName = await User.findOne({ username });
if (existingUserName) {
  return NextResponse.json({ error: "Username already exists" }, { status: 400 });
}


    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save new user
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    // Send verification email
    // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    // ✅ Create token using savedUser
    const tokenData = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

   

    // ✅ Set token as HttpOnly cookie
    
    // Return success response
    const response = NextResponse.json({
      message: "User created successfully",
      success: true,
      user: savedUser,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });
    console.log(response)
    return response;

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
