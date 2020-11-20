import sortBy from 'lodash/sortBy';
import AWS from 'aws-sdk';

export default async (event, context, callback) => {
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
    const { numberOfDaysDisplayed } = event.queryStringParameters;
    console.log(numberOfDaysDisplayed);
    const sortedItems = sortBy(Items, 'creation_date');
    const ratingsToBeDisplayed = numberOfDaysDisplayed
      ? sortedItems.slice(
        sortedItems.length - numberOfDaysDisplayed,
        sortedItems.length,
      )
      : sortedItems;
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(ratingsToBeDisplayed),
    };

    callback(null, response);
  } catch (error) {
    callback(new Error('internal server error'));
  }
};
