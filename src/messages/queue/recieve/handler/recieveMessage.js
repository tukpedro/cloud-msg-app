const { getUser } = require("../../../../users/get/service/getUser.service");
const returnResponseHelper = require("../../../../common/return-response.helper");
const { receiveMessages } = require("../service/recieveMessage.service");
const { validatePhoneNumber } = require("../../../../common/validate-phone");
const { deleteMessageFromSQS } = require("../../delete/service/deleteMessage.service");

module.exports.handler = async event => {
    const { queryStringParameters } = event;
    if (!queryStringParameters) return returnResponseHelper({ error: "Invalid queryStringParameters" }, 400);

    const { phone, messageGroupId } = queryStringParameters;
    if (!phone) return returnResponseHelper({ error: "Phone not found on request" }, 400);

    if (!validatePhoneNumber(phone))
        return returnResponseHelper({ error: "Invalid phone number" }, 400);

    const userExists = await getUser(phone);
    if (!userExists)
        return returnResponseHelper({ error: "User not found" }, 404);

    const messages = await receiveMessages(messageGroupId);
    if (!messages)
        return returnResponseHelper({ error: "Error receiving messages" }, 500);

    const { Body, ReceiptHandle } = messages[0];
    if (!Body)
        return returnResponseHelper({ error: "Error parsing message" }, 500);

    const { content } = JSON.parse(Body);

    await deleteMessageFromSQS(ReceiptHandle);

    return returnResponseHelper({ message: content }, 200);
}