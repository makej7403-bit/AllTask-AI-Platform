import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const modulePath = path.join(process.cwd(), "modules", `${id}.json`);

    if (!fs.existsSync(modulePath)) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const data = fs.readFileSync(modulePath, "utf8");
    const json = JSON.parse(data);

    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load module" }, { status: 500 });
  }
}
