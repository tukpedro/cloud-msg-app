const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { region, queue_name } = require("../../../../config");
const { checkCreateQueue } = require("../../../../common/check-create-queue");

const sqsClient = new SQSClient({ region });

module.exports.sendMessageToSQS = async (senderPhone, receiverPhone, content) => {
    const { QueueUrl } = await checkCreateQueue(queue_name);
    if (!QueueUrl) {
        return false;
    }

    const messageBody = {
        senderPhone,
        receiverPhone,
        content,
        createdAt: new Date().toISOString()
    };

    const params = {
        QueueUrl,
        MessageBody: JSON.stringify(messageBody),
        MessageGroupId: senderPhone + receiverPhone,
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        return { ...data, ...params };
    } catch (error) {
        console.error("Error sending to SQS:", error);
        return false;
    }
}
