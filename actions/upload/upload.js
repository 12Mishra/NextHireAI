"use server"
import { auth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto"
import prisma from "@/lib/db";

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

// const acceptedType = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]

const s3Client = new S3Client({
    region: process.env.NEXT_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
    },
})

const acceptedSize = 1024 * 1024 * 10; //10MB

export async function getSignedURL(type, size, checksum, fileName) {

    const session = await auth();
    console.log(session);
    
    if (!session) {
        return { failure: "Not authenticated" };
    }
    console.log(type, size, checksum, fileName);
    
    // if (!acceptedType.includes(type)) {
    //     return { failure: "File type not supported" }
    // }
    
    if (size > acceptedSize) {
        return { failure: "File size too big" }
    }

    const fileKey = generateFileName();

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
        Key: fileKey,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        Metadata: {
            userId: session?.user?.id
        }
    })
    const url = await getSignedUrl(
        s3Client,
        putObjectCommand,
        { expiresIn: 60 }
    )

    console.log({ url });
    console.log(parseInt(session.user.id));
    
    //before returning from the function we need to implement a logic to include the files in the db

    const findUser = await prisma.user.findUnique({
        where: {
            id: parseInt(session.user.id)
        }
    })
    console.log(findUser);

    const sizeStored=size/(1024*1024).toFixed(2);
    console.log(sizeStored);
    
    const dbRes = await prisma.files.create({
        data: {
            fileName: fileName,
            fileURL: url.split("?")[0],
            fileSize: sizeStored,
            user: {
                connect: { id: parseInt(session.user.id) }
            }

        }
    });

    return {
        success: {
            url: url,
            id: dbRes.id,
        }
    }
}

// export async function displayFiles(session) {
//     try {
//         if (!session?.user?.id) {
//             return { error: "User not authenticated" };
//         }

//         const response = await prisma.files.findMany({
//             where: { user: { id: parseInt(session.user.id) } },
//             include: { user: true }
//         });

//         console.log(response);

//         return { success: { response } };

//     } catch (error) {
//         console.error("Error occurred:", error);
//         return { error: "Failed to fetch files" };
//     }
// }