const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Delete a Product
module.exports.handler = async (event) => {
  const path = +event.pathParameters.id;
  try {
    const requestBody = JSON.parse(event.body);
    const params = {
      TableName: 'product',
      Key: {
        id: Number(path),
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting Product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete Product' }),
    };
  }
};
