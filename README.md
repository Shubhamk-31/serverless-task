# serverless-task

please find my serverless task and instruction for this setup

# Routes

Create Product: https://am2e25v6cc.execute-api.us-east-1.amazonaws.com/dev/product (Method Post)
List product: https://o66dwzeta7.execute-api.us-east-1.amazonaws.com/dev/product (Method Get)
Product Details: https://t7tpjhids6.execute-api.us-east-1.amazonaws.com/dev/product/:id (Method Get)
Update Product: https://x2renxf52a.execute-api.us-east-1.amazonaws.com/dev/product/:id (Method Put)
Delete Product: https://zto10mn5pg.execute-api.us-east-1.amazonaws.com/dev/product/:id (Method Delete)

# Notes
I have used the serverless framework as described the Task

DynamoDB is used as DataBase

Code can be deployed By going into each function Directory, making changes as required and Run the command "serverless Deploy"
