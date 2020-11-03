import sortBy from 'lodash/sortBy';

const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
  try {
    const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-2',
      apiVersion: '2018-05-21',
    });
    const params = {
      TableName: 'Ratings',
      ProjectionExpression: 'creation_date, rating',
      FilterExpression: 'user_id = :userId',
      ExpressionAttributeValues: { ':userId': 'kevinou' },
    };
    const { Items } = await dynamoDocumentClient.scan(params).promise();
    const sortedItems = sortBy(Items, 'creation_date');
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(sortedItems),
    };

    callback(null, response);
  } catch (error) {
    callback(new Error('internal server error'));
  }
};
