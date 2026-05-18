import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || 'bunyad-properties',
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET || 'bunyad-properties',
    Key: key,
  });

  await s3Client.send(command);
}

export function generateS3Key(userId: string, propertyId: string, filename: string): string {
  const timestamp = Date.now();
  return `properties/${userId}/${propertyId}/${timestamp}-${filename}`;
}

export function getS3Url(key: string): string {
  return `${process.env.S3_URL || 'https://bunyad-properties.s3.amazonaws.com'}/${key}`;
}
