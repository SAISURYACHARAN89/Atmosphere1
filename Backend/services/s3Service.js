const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// Lazy initialization of S3 client to ensure env vars are loaded
let s3Client = null;

const getS3Client = () => {
    if (!s3Client) {
        // Validate credentials
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            console.error('AWS credentials missing! Check your .env file.');
            console.error('Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET');
            throw new Error('AWS credentials not configured');
        }

        s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        console.log('S3 Client initialized for region:', process.env.AWS_REGION);
    }
    return s3Client;
};

const getBucketName = () => process.env.AWS_S3_BUCKET || 'atmosphere-media';

/**
 * Generate a unique filename
 */
const generateFileName = (originalName, prefix = 'upload') => {
    const ext = originalName.split('.').pop();
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${prefix}/${timestamp}-${uniqueId}.${ext}`;
};

/**
 * Upload an image to S3 and return a presigned URL for viewing
 */
exports.uploadImage = async (fileBuffer, mimetype = 'image/jpeg', originalName = 'image.jpg') => {
    const client = getS3Client();
    const bucket = getBucketName();
    const key = generateFileName(originalName, 'images');

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
    });

    await client.send(command);

    // Generate presigned URL for viewing (valid for 7 days)
    const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const url = await getSignedUrl(client, getCommand, { expiresIn: 604800 }); // 7 days

    return { url, key };
};

/**
 * Upload a video to S3
 */
exports.uploadVideo = async (fileBuffer, mimetype = 'video/mp4', originalName = 'video.mp4') => {
    const client = getS3Client();
    const bucket = getBucketName();
    const key = generateFileName(originalName, 'reels');

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
    });

    await client.send(command);

    // Generate presigned URL for video access (valid for 7 days)
    const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const url = await getSignedUrl(client, getCommand, { expiresIn: 604800 }); // 7 days
    const thumbnailUrl = url; // Use same URL as thumbnail for now

    return { url, key, thumbnailUrl };
};

/**
 * Upload a document (pdf/docx/txt) to S3 and return a presigned URL for viewing
 */
exports.uploadDocument = async (fileBuffer, mimetype = 'application/pdf', originalName = 'document.pdf') => {
    const client = getS3Client();
    const bucket = getBucketName();
    const key = generateFileName(originalName, 'documents');

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
    });

    await client.send(command);

    const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const url = await getSignedUrl(client, getCommand, { expiresIn: 604800 }); // 7 days

    return { url, key };
};

/**
 * Delete a file from S3
 */
exports.deleteFile = async (key) => {
    if (!key) return;

    try {
        const client = getS3Client();
        const bucket = getBucketName();

        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        await client.send(command);
    } catch (error) {
        console.error('S3 delete error:', error);
        throw error;
    }
};

/**
 * Generate a presigned URL for direct upload from client
 */
exports.getPresignedUploadUrl = async (fileName, fileType, folder = 'uploads') => {
    const client = getS3Client();
    const bucket = getBucketName();
    const key = generateFileName(fileName, folder);

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl, key };
};

/**
 * Refresh a signed URL if it's expired (or just always refresh for safety)
 * extracts key from the old URL and generates a new one.
 */
exports.refreshSignedUrl = async (oldUrl) => {
    if (!oldUrl || !oldUrl.includes('amazonaws.com')) return oldUrl;
    
    try {
        // Extract Key from URL
        // Format: https://bucket.s3.region.amazonaws.com/KEY
        const urlObj = new URL(oldUrl);
        // Pathname starts with /, so slice(1) to get Key
        const key = urlObj.pathname.slice(1);
        
        if (!key) return oldUrl;

        const client = getS3Client();
        const bucket = getBucketName();

        const getCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const newUrl = await getSignedUrl(client, getCommand, { expiresIn: 604800 }); // 7 days
        return newUrl;
    } catch (error) {
        // If parsing fails, return old URL
        return oldUrl;
    }
};

exports.getS3Client = getS3Client;
exports.getBucketName = getBucketName;
