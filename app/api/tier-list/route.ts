import { NextResponse } from "next/server"
import { getTierListData } from "@/lib/tier-list-data"

export const revalidate = 86400 // revalidate every 24 hours

export async function GET() {
  const data = getTierListData()
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  })
}
