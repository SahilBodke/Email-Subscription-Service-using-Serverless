// Second Lambda Function

const AWS = require("aws-sdk");
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const uuid = require("uuid")

module.exports.subscribeUser = (event, context, callback) => {

    const data = JSON.parse(event.body);
    console.log("Event:::", data);

    const timestamp = new Date().getTime;

    if (typeof data.email !== "string") {
        console.error("Validation Failed!");
        return;
    }

    // Creating object containing parameters to be passed to dynamodb database 
    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: uuid.v4(),   // Unique user id for every user
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // add the user to the database
    dynamoDb.put(params, (error, data) => {
        if (error){
            console.error(error);
            callback(new Error(error));
            return;
        }
        
        // create response
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item),
        };
        callback(null, response);
    });
};




