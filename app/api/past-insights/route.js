import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    console.log(session?.user?.id);

    const analysis = await prisma.pastInsights.findMany({
        where: {
            userId: parseInt(session.user.id)
        }
    });

    if (!analysis || analysis.length === 0) {
        return NextResponse.json({ error: "Could not find past insights of user" }, { status: 404 });
    }

    const fileIds = analysis.map((insight) => insight.fileId); 
    const analysisFiles = await prisma.files.findMany({
        where: {
            id: { in: fileIds } 
        }
    });

    const response = analysis.map((insight) => ({
        insights: insight.insights,
        createdAt: insight.createdAt,
        fileUrl: analysisFiles.find((file) => file.id === insight.fileId)?.fileURL || null
    }));

    return NextResponse.json(response, { status: 200 });
}
