const { SQSClient, ReceiveMessageCommand } = require("@aws-sdk/client-sqs");
const { checkCreateQueue } = require("../../../../common/check-create-queue");
const { region, queue_name } = require("../../../../config");

const sqsClient = new SQSClient({ region });

module.exports.receiveMessages = async (messageGroupId) => {
    const { QueueUrl } = await checkCreateQueue(queue_name);
    if (!QueueUrl) {
        return false;
    }

    const params = {
        QueueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 60,
        AttributeNames: ['MessageGroupId']
    };

    try {
        const { Messages } = await sqsClient.send(new ReceiveMessageCommand(params));
        if (!Messages) {
            return false;
        }

        const filteredMessages = Messages.filter(message => message.Attributes.MessageGroupId === messageGroupId);

        return filteredMessages;
    } catch (error) {
        console.error("Erro ao receber mensagens do SQS:", error);
    }
}