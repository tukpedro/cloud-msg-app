const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { region, messages_table } = require('../../../config/index');
const { checkCreateTable } = require('../../../common/check-create-table');
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({ region });

module.exports.createMessage = async body => {
    await checkCreateTable(messages_table, 'id');

    const marshallBody = marshall(body);
    marshallBody.id = { S: uuidv4() };
    marshallBody.created_at = { S: new Date().toISOString() };

    const params = {
        TableName: messages_table,
        Item: marshallBody,
    };


    try {
        await dynamoClient.send(new PutItemCommand(params));
        return { ...body };
    } catch (error) {
        console.error(error);
        return false;
    }
}