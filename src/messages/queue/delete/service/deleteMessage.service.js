const { SQSClient, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const { checkCreateQueue } = require("../../../../common/check-create-queue");
const { region, queue_name } = require("../../../../config");

const sqsClient = new SQSClient({ region });

module.exports.deleteMessageFromSQS = async (receiptHandle) => {
    const { QueueUrl } = await checkCreateQueue(queue_name);
    if (!QueueUrl) {
        return false;
    }

    const params = {
        QueueUrl,
        ReceiptHandle: receiptHandle
    };

    try {
        const data = await sqsClient.send(new DeleteMessageCommand(params));
        console.log("Message successfuly deleted from SQS:", data);
    } catch (error) {
        console.error("Error from SQS:", error);
    }
}
