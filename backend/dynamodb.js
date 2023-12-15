require("dotenv").config({ path: "../.env" });
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.AWS_BUCKET_REGION });

const dynamoDB = new AWS.DynamoDB();

function insertItem({ fileKey, isPublic = false, description }) {
  var params = {
    TableName: "ImagesCollection",
    Item: {
      ObjectId: { S: fileKey },
      fileKey: { S: fileKey },
      IsPublic: { BOOL: isPublic },
      Description: { S: description },
      CreatedDateTime: { S: Date().toString().toLocaleLowerCase() },
    },
  };

  // Call DynamoDB to add the item to the table

  return dynamoDB.putItem(params).promise();
}

function getAllPublicItem() {
  const params = {
    TableName: "ImagesCollection",
    FilterExpression: "IsPublic = :value",
    ExpressionAttributeValues: {
      ":value": { BOOL: true },
    },
  };

  return dynamoDB.scan(params).promise();
}

// function deleteItem(fileKey) {
//   const params = {
//     TableName: "ImagesCollection",
//     Key: {
//       fileKey: { S: fileKey },
//     },
//   };

//   return dynamoDB.deleteItem(params, (err, data) => {});
// }

module.exports = {
  getAllPublicItem,
  insertItem,
};
