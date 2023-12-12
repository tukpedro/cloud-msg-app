const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { region, key_type, attribute_type } = require('../config/index');

const dynamoClient = new DynamoDBClient({ region });

module.exports.checkCreateTable = async (tableName, attributeName) => {
    const data = await dynamoClient.send(new ListTablesCommand({}));
    const existingTables = data.TableNames;

    if (existingTables.includes(tableName)) {
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: attributeName, KeyType: key_type },
        ],
        AttributeDefinitions: [
            { AttributeName: attributeName, AttributeType: attribute_type },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    try {
        await dynamoClient.send(new CreateTableCommand(params));
        await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
        console.error("Create table error:", error);
    }
}

