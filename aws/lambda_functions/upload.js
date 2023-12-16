const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
  console.log(event);

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully uploaded file to S3" }),
  };

  try {
    const parsedBody = JSON.parse(event.body);
    const base64File = parsedBody.file;
    const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");

    const params = {
      Bucket: BUCKET_NAME,
      Key: `images/${new Date().toISOString()}.jpeg`,
      Body: decodedFile,
      ContentType: "image/jpeg",
    };

    const uploadResult = await s3.upload(params).promise();

    response.body = JSON.stringify({ message: "Successfully uploaded to S3", uploadResult });
  } catch (err) {
    console.error(err);
    response.body = JSON.stringify({ messgae: "File failed to upload", err });
    response.statusCode = 500;
  }

  return response;
};
