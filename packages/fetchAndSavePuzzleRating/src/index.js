const AWS = require('aws-sdk');
const superagent = require('superagent');

exports.handler = async () => {
  try {
    const { tableName, region, userId } = process.env;
    const userInfo = await superagent.get(`https://lichess.org/api/user/${userId}`);
    const { rating } = userInfo.body.perfs.puzzle;
    const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient({
      region,
      apiVersion: '2018-05-21',
    });

    await dynamoDocumentClient.put({
      TableName: tableName,
      Item: {
        creation_date: String(new Date().toISOString()),
        user_id: userId,
        rating,
      },
    }).promise();
  } catch (error) {
    console.warn('Error', error);
  }
};
