const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get Products
module.exports.handler = async () => {
  try {
    const params = {
      TableName: 'product',
    };

    const result = await dynamoDB.scan(params).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error fetching Products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch Products' }),
    };
  }
};