const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get Products
module.exports.handler = async (event) => {
  try {
    const path = +event.pathParameters.id;
    const params = {
      TableName: 'product',
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': path, 
    }
  };
    const result = await dynamoDB.scan(params).promise();
    if(result.Items.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({message:"Product not Found"}),
      };
    }
    
  } catch (error) {
    console.error('Error fetching Products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch Products' }),
    };
  }
};