import AWS from 'aws-sdk';
import axios from 'axios';

export default async (event, context, callback) => {
  try {
    const userInfo = await axios.get('https://lichess.org/api/user/kevinou');
    const { rating } = userInfo.data.perfs.puzzle;
    const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-2',
      apiVersion: '2018-05-21',
    });

    await dynamoDocumentClient.put({
      TableName: 'Ratings',
      Item: {
        creation_date: String(new Date().toISOString()),
        user_id: 'kevinou',
        rating,
      },
    }).promise();

    const response = {
      statusCode: 200,
      body: `Rating: ${rating}`,
    };

    callback(null, response);
  } catch (error) {
    console.warn('Error', error);
    callback(error);
  }
};
