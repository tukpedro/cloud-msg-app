const { SQSClient, ListQueuesCommand, CreateQueueCommand } = require("@aws-sdk/client-sqs");
const { region } = require("../config");

const sqsClient = new SQSClient({ region });

module.exports.checkCreateQueue = async (queueName) => {
    try {
        const data = await sqsClient.send(new ListQueuesCommand({}));
        const queues = data.QueueUrls || [];

        const queueExists = queues.some(url => url.includes(queueName));

        if (!queueExists) {
            const createQueueData = await sqsClient.send(new CreateQueueCommand({ QueueName: queueName }));
            console.log(`Created queue: ${createQueueData.QueueUrl}`);
            return { queueUrl: createQueueData.QueueUrl }
        } else {
            console.log(`Queue already exists`);
            const url = queues.find(url => url.includes(queueName));
            return { queueUrl: url };
        }
    } catch (error) {
        console.error("Check/Create queue error:", error);
        return false;
    }
}
