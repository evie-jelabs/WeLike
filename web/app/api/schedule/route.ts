import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "schedule.json");

type Schedule = {
  enabled: boolean; time: string; sections: string[];
  lang: string; token: string; chatId: string; lastSentDate: string;
};

function load(): Schedule {
  const d: Schedule = { enabled: false, time: "09:00", sections: ["news"], lang: "zh", token: "", chatId: "", lastSentDate: "" };
  try { if (fs.existsSync(FILE)) return { ...d, ...JSON.parse(fs.readFileSync(FILE, "utf8")) }; } catch {}
  return d;
}

export async function GET() {
  const { token: _t, ...safe } = load();
  return NextResponse.json(safe);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  fs.writeFileSync(FILE, JSON.stringify({ ...load(), ...body }, null, 2));
  return NextResponse.json({ ok: true });
}
