import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import { EmployeeModel } from "@/models/Employee";

// GET all employees
export async function GET() {
  try {
    await connectDB();
    const employees = await EmployeeModel.find({visibleOnWebsite: true}).sort({ createdAt: -1 });    
    // console.log(employees)
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}