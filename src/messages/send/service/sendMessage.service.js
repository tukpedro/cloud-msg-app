const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { region, queue_name } = require("../../../config");
const { checkCreateQueue } = require("../../../common/check-create-queue");

const sqsClient = new SQSClient({ region });

module.exports.sendMessageToSQS = async (senderPhone, receiverPhone, content) => {
    const { queueUrl } = await checkCreateQueue(queue_name);
    if (!queueUrl) {
        return false;
    }

    const messageBody = {
        senderPhone,
        receiverPhone,
        content,
        createdAt: new Date().toISOString()
    };

    const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Message sento to Queue, ID:", data.MessageId);
        return { ...data };
    } catch (error) {
        console.error("Erro ao enviar mensagem para SQS:", error);
        return false;
    }
}
