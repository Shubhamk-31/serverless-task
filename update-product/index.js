const AWS = require('aws-sdk');
const Joi = require('joi');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Update a Product
module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const schema = Joi.object({
      name: Joi.string().required(),
      desccription: Joi.string().required(),
    });
    const path = +event.pathParameters.id;
    console.log(1112223444);
    console.log(path);
    const validate = await checkValidate(schema, requestBody);
    if (validate.statusCode == 400) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not create Product' }),
      };
    }
    const params = {
      TableName: 'product', // Replace with your DynamoDB table name
      Key: {
        id: path,
      },
      UpdateExpression: 'SET #name = :nameValue, #description = :descriptionValue', // Update name and description
      ExpressionAttributeNames: {
        '#name': 'name', // Map '#name' to 'name' attribute
        '#description': 'description', // Map '#description' to 'description' attribute
      },
      ExpressionAttributeValues: {
        ':nameValue': requestBody.name, // Replace with the new name value
        ':descriptionValue': requestBody.description, // Replace with the new description value
      },
    };
    console.log(params);
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
    const validate = schema.validate(body);

    if (validate.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
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
