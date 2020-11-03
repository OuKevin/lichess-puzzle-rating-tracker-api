import AWS from 'aws-sdk';
import superagent from 'superagent';

exports.handler = async () => {
  try {
    const userInfo = await superagent.get('https://lichess.org/api/user/kevinou');
    const { rating } = userInfo.body.perfs.puzzle;
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
  } catch (error) {
    console.warn('Error', error);
  }
};
