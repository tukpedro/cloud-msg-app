const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { region } = require('../config/index');

const dynamoClient = new DynamoDBClient({ region });

module.exports.checkCreateTable = async (tableName, attribiteName) => {
    const data = await dynamoClient.send(new ListTablesCommand({}));
    const existingTables = data.TableNames;

    if (existingTables.includes(tableName)) {
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: attribiteName, KeyType: "HASH" },
        ],
        AttributeDefinitions: [
            { AttributeName: attribiteName, AttributeType: "S" },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    try {
        const results = await dynamoClient.send(new CreateTableCommand(params));
        console.log("Tabela de usuários criada:", results);
    } catch (error) {
        console.error("Não foi possível criar a tabela:", error);
    }
}

