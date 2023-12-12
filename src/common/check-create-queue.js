const { SQSClient, ListQueuesCommand, CreateQueueCommand, GetQueueUrlCommand } = require("@aws-sdk/client-sqs");
const { region } = require("../config");

const sqsClient = new SQSClient({ region });

module.exports.checkCreateQueue = async (queueName) => {
    try {
        const data = await sqsClient.send(new ListQueuesCommand({}));
        const queues = data.QueueUrls || [];

        const queueExists = queues.some(url => url.includes(queueName));

        if (!queueExists) {
            const { QueueUrl } = await sqsClient.send(new CreateQueueCommand({
                QueueName: queueName,
                Attributes: {
                    FifoQueue: 'true',
                    ContentBasedDeduplication: 'true',
                }
            }));
            console.log(`Created queue: ${QueueUrl}`);
            return { QueueUrl }
        } else {
            const { QueueUrl } = await sqsClient.send(new GetQueueUrlCommand({ QueueName: queueName }));
            return { QueueUrl };
        }
    } catch (error) {
        console.error("Check/Create queue error:", error);
        return false;
    }
}
