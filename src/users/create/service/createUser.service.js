const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { region, users_table, users_pk } = require('../../../config/index');
const { checkCreateTable } = require('../../../common/check-create-table');

const dynamoClient = new DynamoDBClient({ region });

module.exports.createUser = async body => {
    await checkCreateTable(users_table, users_pk);

    const params = {
        TableName: users_table,
        Item: marshall(body),
    };

    try {
        await dynamoClient.send(new PutItemCommand(params));
        return { ...body };
    } catch (error) {
        console.error(error);
        return error;
    }
}