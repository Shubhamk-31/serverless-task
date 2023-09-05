const AWS = require('aws-sdk');
const Joi = require('joi');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Update a Product
module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    });
    const path = +event.pathParameters.id;
    const validate = await checkValidate(schema, requestBody);
    if (validate.statusCode == 400) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: validate?.body }),
      };
    }
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
        id: path,
      },
      UpdateExpression: 'SET #name = :nameValue, #description = :descriptionValue', 
      ExpressionAttributeNames: {
        '#name': 'name', 
        '#description': 'description', 
      },
      ExpressionAttributeValues: {
        ':nameValue': requestBody.name, 
        ':descriptionValue': requestBody.description, 
      },
    };
    await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating Product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update Product' }),
    };
  }
}
async function checkValidate(schema, body) {
  try {
    const {error} = schema.validate(body);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.details[0].message ),
      };
    }
    return {
      statusCode: 200
    }
  } catch (error) {
    console.error('Error creating Product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create Product' }),
    };
  }
}

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
