// app/api/links/[code]/route.ts
import { NextResponse } from 'next/server';
// ADJUST PATH: If lib is a sibling of app, use:
import {prisma} from '../../../../lib/prisma';

// GET: Stats for one code
export async function GET(req: Request, { params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(link);
}

// DELETE: Remove a link
export async function DELETE(req: Request, { params }: { params: { code: string } }) {
  try {
    await prisma.link.delete({ where: { code: params.code } });
    return new NextResponse(null, { status: 204 }); // Standard success for deletion
  } catch (e) {
    // If the link doesn't exist, it still returns a 404/not found error
    return NextResponse.json({ error: "Link not found or already deleted" }, { status: 404 });
  }
}