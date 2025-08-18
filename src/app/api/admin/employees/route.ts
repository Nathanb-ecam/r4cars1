import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import { EmployeeModel } from "@/models/Employee";

// GET all employees
export async function GET() {
  try {
    await connectDB();
    const employees = await EmployeeModel.find().sort({ createdAt: -1 });    
    // console.log(employees)
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// CREATE new employee
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const employee = await EmployeeModel.create(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
