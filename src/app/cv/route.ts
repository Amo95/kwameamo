import { NextResponse } from "next/server";
import { getVisitorRegion } from "@/lib/geo";

// The CV for the visitor's region: the EU version for visitors in the EU, the other one for everyone else.
export async function GET(request: Request) {
  const region = await getVisitorRegion();
  const file = region === "EU" ? "/james-amo-cv.pdf" : "/james-amo-cv-non-europe.pdf";
  return NextResponse.redirect(new URL(file, request.url), 307);
}
