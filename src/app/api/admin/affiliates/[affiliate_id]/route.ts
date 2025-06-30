import { env } from "@/config/env";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';


export async function DELETE(
  request: Request, 
  // { params }: { params: { affiliate_id: string } }
  {params}: { params: Promise<{ affiliate_id: string }> }
):Promise<Response> {
    
  // const { params } = params;
  const {affiliate_id} = await params;
    // const affiliateId = await context.params.affiliate_id;
  
    console.log("__________DELETE_AFFILIATE__________")
    console.log(affiliate_id)
    const res = await fetch(`${env.goaffpro.apiUrl}/admin/affiliates/${affiliate_id}`, {
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