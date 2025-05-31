import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import { env } from '@/config/env';
import Cookies from 'js-cookie';

export async function POST(request: NextRequest) {
  try {
  
  const { doctorIdentificationNumber, refCode } = await request.json();    
    const url = `${env.goaffpro.apiUrl}/admin/affiliates`
    
    const params = new URLSearchParams({    
      tag: doctorIdentificationNumber,      
      ref_code: refCode,
      fields: "id", // name,email,ref_codes,tags,coupons"  (comma-separated fields)
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
    
    console.log({affiliates, total_results})
    if(total_results <1){
      return NextResponse.json(
        { error: 'Invalid doctor number or access code' },
        { status: 401 }
      );
    }
      
    
    


    const token = await generateToken({      
      role: UserRole.VISITOR,
      userId:"",
      email:""
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        affiliate_id:affiliates[0]?.id.toString()       
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // const affiliate_id : string = affiliates[0]?.id.toString()
    // console.log("Set cookie affiliate_id" + affiliate_id)
    // response.cookies.set({
    //   name: 'affiliate_id',
    //   value: affiliate_id,
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 // 24 hours
    // });

    return response;
  } catch (error) {
    console.error('Access code login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 