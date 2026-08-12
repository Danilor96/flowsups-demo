import { mockDb } from "@/app/libs/mock-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = mockDb.task_due_time_limit.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: "Server Error" }, { status: 500 });
  }
}
