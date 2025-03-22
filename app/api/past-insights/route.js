import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    //db call to fetch the insights
    console.log(session?.user?.id);

    const analysis = await prisma.pastInsights.findFirst({
        where: {
            userId: parseInt(session.user.id)
        }
    })

    const analysisFile = await prisma.files.findFirst({
        where: {
            id: analysis.fileId
        }
    })

    console.log(JSON.stringify(analysis, null, 2));
    console.log(analysisFile.fileURL);


    if (!analysis) {
        return NextResponse.json({ error: 'Could not find past insights of user' }, { status: 404 })

    }

    return NextResponse.json(
        { body: analysis.insights, fileurl: analysisFile.fileURL || null, createdAt:analysis.createdAt},
        { status: 200 }
    );
}