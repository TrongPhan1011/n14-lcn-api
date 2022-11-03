const { S3Client } = require('@aws-sdk/client-s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const dotenv = require('dotenv');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const generateOneUrlFile = async (fileName) => {
    var url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        }),
        { expiresIn: 60 * 60 }, // 60 seconds
    );
    return url;
};
module.exports = generateOneUrlFile;
