const { validatePhoneNumber } = require("../../../common/validate-phone");
const { getUser } = require("../../../users/get/service/getUser.service");
const { sendNotificationViaSNS } = require("../service/sendNotification.service");

module.exports.handler = async event => {
    const { body } = event;

    if (!body) return returnResponseHelper({ error: "Invalid body" }, 400);

    const parsedBody = JSON.parse(body);

    const { message, receiverPhone } = parsedBody;

    if (!validatePhoneNumber(receiverPhone))
        return returnResponseHelper({ error: "Invalid phone number" }, 400);

    if (!message) return returnResponseHelper({ error: "Invalid message" }, 400);

    const checkPhoneInDb = await getUser(receiverPhone);
    if (!checkPhoneInDb) return returnResponseHelper({ error: "User not found" }, 404);

    return returnResponseHelper(await sendNotificationViaSNS(message, receiverPhone), 201);
}