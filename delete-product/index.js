const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Delete a Product
module.exports.handler = async (event,callback,context) => {
  const path = +event.pathParameters.id;
  try {
    const requestBody = JSON.parse(event.body);

    const productExist = await checkProductExist(path);
    if(productExist) {
      return {
        statusCode: 500,
      body: JSON.stringify({ message: 'Product Not Found' }),
      }
    }
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

async function checkProductExist(id) {
  try{
    const params = {
      TableName: 'product',
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id, 
    }
  };
    const result = await dynamoDB.scan(params).promise();
    if(result.Items.length == 0) {
      return true
    } else {
      return false
    }
  }catch (error) {
    console.error('Product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete Product' }),
    };
  }
}
