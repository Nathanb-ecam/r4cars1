import { env } from "@/config/env";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { affiliate_id: string } }) {
    
    const affiliateId = await params.affiliate_id;
  
    console.log("__________DELETE_AFFILIATE__________")
    console.log(affiliateId)
    const res = await fetch(`${env.goaffpro.apiUrl}/admin/affiliates/${affiliateId}`, {
      method: "DELETE",
      headers: {
        "x-goaffpro-access-token": env.goaffpro.accessToken,
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }
    
    return NextResponse.json({ message: "Affiliate deleted successfully" }, { status: 200 });
  }