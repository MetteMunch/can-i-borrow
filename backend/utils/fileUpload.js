import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getUploadUrl(filename) {
  const client = new S3Client({
    region: 'eu-central',
    endpoint: process.env.HETZNER_ENDPOINT,
    credentials: {
      accessKeyId: process.env.HETZNER_ACCESS,
      secretAccessKey: process.env.HETZNER_SECRET,
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.HETZNER_BUCKET,
    Key: filename,
    ContentType: 'image/jpeg',
  });

  return await getSignedUrl(client, command, { expiresIn: 300 });
}
