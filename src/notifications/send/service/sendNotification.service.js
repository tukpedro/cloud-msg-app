const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { region } = require("../../../config");

const snsClient = new SNSClient({ region });

module.exports.sendNotificationViaSNS = async (message, receiverPhone) => {
    const params = {
        Message: message,
        PhoneNumber: receiverPhone,
    };

    try {
        const data = await snsClient.send(new PublishCommand(params));
        console.log("SMS sent, ID:", data.MessageId);
    } catch (error) {
        return error;
    }
}
