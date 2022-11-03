const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
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

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const messageREST = {
    uploadFile: async (req, res) => {
        try {
            var arrFile = req.files;

            var listFile = [];
            for (var file of arrFile) {
                var fileName = generateFileName();
                var fileType = file.mimetype.split('/')[0];
                if (fileType !== 'image' || fileType !== 'video') {
                    fileType = 'doc';
                }

                var params = {
                    Bucket: bucketName,
                    Body: file.buffer,
                    Key: fileName,
                    ContentType: file.mimetype,
                };
                const command = new PutObjectCommand(params);
                await s3Client.send(command);

                var getUrl = process.env.AWS_BUCKET_PUBLIC + fileName;

                listFile.push({
                    fileType: fileType,
                    title: file.originalname,
                    path: getUrl,
                });
            }

            res.send(listFile);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

module.exports = messageREST;
