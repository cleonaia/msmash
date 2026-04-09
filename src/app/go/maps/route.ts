import { NextResponse } from 'next/server';

const GOOGLE_MAPS_LOCATION_URL =
  'https://www.google.com/maps/place/M+Smash+burguer/@41.5603212,2.0107491,17z/data=!4m15!1m8!3m7!1s0x12a492eba497c373:0xeff2de64e56501b3!2sCarrer+del+Col%C2%B7legi,+5,+08221+Terrassa,+Barcelona!3b1!8m2!3d41.5603212!4d2.0107491!16s%2Fg%2F11bw43phvd!3m5!1s0x12a49352c0c63c67:0xf4ff907d344c16ad!8m2!3d41.5603212!4d2.0107491!16s%2Fg%2F11z10g_12j?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D';

export function GET() {
  return NextResponse.redirect(GOOGLE_MAPS_LOCATION_URL, 308);
}
