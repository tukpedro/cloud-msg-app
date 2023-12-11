const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { region, users_table } = require('../../../config/index');

const dynamoClient = new DynamoDBClient({ region });

module.exports.getUser = async phone => {
    const params = {
        ExpressionAttributeNames: {
            '#phone': 'phone',
        },
        ExpressionAttributeValues: marshall({
            ':phone': phone,
        }),
        KeyConditionExpression: '#phone = :phone',
        TableName: users_table,
    };

    try {
        const response = await dynamoClient.send(new QueryCommand(params));

        if (!response?.Items || response?.Items?.length == 0) {
            return false;
        }

        const user = unmarshall(response.Items[0]);
        return user;
    } catch (error) {
        console.info('DynamoDB Query Error', error);
        return false;
    }
}