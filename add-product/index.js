const AWS = require('aws-sdk');
const Joi = require('joi');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create a new Product
module.exports.handler = async (event) => {
  try {
    const id = new Date().getTime()
    const schema = Joi.object({
      name: Joi.string().required(),
      desccription: Joi.string().required(),
    });
    const requestBody = JSON.parse(event.body);
    const validate = await checkValidate(schema, requestBody)
    if (validate.statusCode == 400) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not create Product' }),
      };
    }
    const params = {
      TableName: 'product',
      Item: { id: id, ...requestBody },
    };
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product created successfully' }),
    };
  } catch (error) {
    console.error('Error creating Product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create Product' }),
    };
  }
};

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

