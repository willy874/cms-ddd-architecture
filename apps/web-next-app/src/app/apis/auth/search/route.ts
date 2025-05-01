import { http } from '@/resources/common'
import { nextRequestToAxiosConfig } from '@/shared/http'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const response = await http().request(nextRequestToAxiosConfig(req))
  return NextResponse.json(Object.assign(response.data, { message: 'GET' }))
}
