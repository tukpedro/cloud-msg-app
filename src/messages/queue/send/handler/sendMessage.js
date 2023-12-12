const returnResponseHelper = require("../../../../common/return-response.helper");
const { sendNotificationViaSNS } = require("../../../../notifications/send/service/sendNotification.service");
const { getUser } = require("../../../../users/get/service/getUser.service");
const { createMessage } = require("../../../create/service/createMessage.service");
const { sendMessageToSQS } = require("../service/sendMessage.service");

module.exports.handler = async (event) => {
    const { body } = event;
    const parsedBody = JSON.parse(body);

    const { sender_phone, receiver_phone, content } = parsedBody;
    if (!sender_phone || !receiver_phone || !content || typeof content !== "string")
        return returnResponseHelper({ error: "Invalid body" }, 400);

    let [sender, receiver] = [await getUser(sender_phone), await getUser(receiver_phone)];

    if (!sender)
        return returnResponseHelper({ error: "Sender not found" }, 404);
    if (!receiver)
        return returnResponseHelper({ error: "Reciever not found" }, 404);

    const sendToQueueResponse = await sendMessageToSQS(sender_phone, receiver_phone, content);
    if (!sendToQueueResponse)
        return returnResponseHelper({ error: "Error sending message to SQS" }, 500);

    const saveMessageResponse = await createMessage(parsedBody);
    if (!saveMessageResponse)
        return returnResponseHelper({ error: "Error saving message on the database" }, 500);

    await sendNotificationViaSNS(content, receiver_phone);

    return returnResponseHelper({ message: "Message successfuly processed" }, 201);
}
