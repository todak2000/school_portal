/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchoolProps } from "@/constants/schools";
import { SchoolService } from "@/firebase/school";
import { generateSchoolCode } from "@/helpers/generateStudentID";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: { name: string; lga: string; description: string } =
      await request.json();

    // Validate input
    if (!body || !body.lga || !body.name) {
      return NextResponse.json(
        { error: "Invalid school data provided." },
        { status: 400 }
      );
    }
    const data: SchoolProps = {
      ...body,
      code: generateSchoolCode(body.name, body.lga),
      avatar: null,
    };

    // Call the function to create the school
    const response = await SchoolService.createSchool(data);

    // Respond with a success message
    return NextResponse.json(
      { message: `Successfully created school: ${body.name}`, data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating school:", error.message);
    return NextResponse.json(
      { error: "Failed to create school.", details: error.message },
      { status: 500 }
    );
  }
}
