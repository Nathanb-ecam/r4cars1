import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import { env } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    
  const { doctorNumber, accessCode } = await request.json();
  console.log(doctorNumber, accessCode)
    const url = `${env.goaffpro.apiUrl}/admin/affiliates`
    
    const params = new URLSearchParams({    
      tag: doctorNumber,      
      ref_code: accessCode
      // fields: "id,name,email,ref_codes,tags,coupons" // comma-separated fields
      // fields: "refs_code" // comma-separated fields
    });
    console.log(url)
  
    const res = await fetch(`${url}?${params.toString()}`, {
          method: 'GET', // Optional, since GET is default
          headers: {          
            'x-goaffpro-access-token':`${env.goaffpro.accessToken}`,          
            // 'x-goaffpro-public-token':`${env.goaffpro.publicToken}`,          
            'Content-Type': 'application/json', // Often a good idea to include
          },
    });
      
    const {affiliates, total_results} = await res.json();
    
    console.log(affiliates)
    if(total_results <1){
      return NextResponse.json(
        { error: 'Invalid doctor number or access code' },
        { status: 401 }
      );
    }
    
    // console.log("VISITOR LOGIN")
    // console.log(JSON.stringify(affiliates))

    
      

    // if (!affiliates[0]?.ref_codes?.includes(accessCode) || !affiliates || total_results < 1) {
    //   console.log("INVALID!");
    //   return NextResponse.json(
    //     { error: 'Invalid doctor number or access code' },
    //     { status: 401 }
    //   );
    // }


    const token = await generateToken({      
      role: UserRole.VISITOR,
      userId:"",
      email:""
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',        
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Access code login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 