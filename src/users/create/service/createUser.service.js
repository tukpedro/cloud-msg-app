const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { region, users_table } = require('../../../config/index');
const { checkCreateTable } = require('../../../common/check-create-table');

const dynamoClient = new DynamoDBClient({ region });

module.exports.createUser = async body => {
    await checkCreateTable(users_table, 'phone');

    const params = {
        TableName: users_table,
        Item: marshall(body),
    };

    try {
        await dynamoClient.send(new PutItemCommand(params));
        return { ...body };
    } catch (err) {
        console.error(err);
        return err;
    }
}