const returnResponseHelper = require("../../../common/return-response.helper");
const { getUser } = require("../../../users/get/service/getUser.service");
const { createMessage } = require("../service/createMessage.service");

module.exports.handler = async event => {
    const { body } = event;
    const parsedBody = JSON.parse(body);

    const { sender_phone, receiver_phone, content } = parsedBody;

    if (!sender_phone || !receiver_phone || !content)
        return returnResponseHelper({ error: "Invalid body" }, 400);

    let [sender, receiver] = [await getUser(sender_phone), await getUser(receiver_phone)];

    if (!sender) return returnResponseHelper({ error: "Sender not found" }, 404);
    if (!receiver) return returnResponseHelper({ error: "Reciever not found" }, 404);

    return returnResponseHelper(await createMessage(parsedBody), 201);
};