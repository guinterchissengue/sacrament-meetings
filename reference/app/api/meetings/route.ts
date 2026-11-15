import { NextRequest, NextResponse } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

// Aceita só YYYY-MM-DD e uma data real (rejeita 2026-02-30, por exemplo).
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? undefined;

  if (date !== undefined && !isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date. Use the format YYYY-MM-DD." },
      { status: 400 }
    );
  }

  try {
    const meetings = await getMeetings(date); // agora é async: await obrigatório
    return NextResponse.json(meetings); // data sem registo -> []
  } catch (error) {
    console.error("GET /api/meetings failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
