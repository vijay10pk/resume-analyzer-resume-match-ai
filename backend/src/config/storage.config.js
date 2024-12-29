require('dotenv').config();

module.exports = {
    type: process.env.STORAGE_TYPE || 'local',
    local: {
        uploadDir: process.env.UPLOAD_DIR || 'uploads',
        maxFileSize: process.env.MAX_FILE_SIZE || '5mb'
    },
    s3: {
        bucket: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    minio: {
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT) || 9000,
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucket: process.env.MINIO_BUCKET_NAME
    }
};
