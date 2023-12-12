const { returnResponseHelper } = require("../../../common/return-response.helper");
const { getUser } = require("../service/getUser.service");

module.exports.handler = async event => {
    const { pathParameters } = event;
    if (!pathParameters) return returnResponseHelper({ error: "Invalid pathparameter" }, 400);

    const { phone } = pathParameters;
    if (!phone) return returnResponseHelper({ error: "Invalid phone" }, 400);

    if (!validatePhoneNumber(phone)) {
        console.error("Invalid phone number:", phone);
        return;
    }

    try {
        return returnResponseHelper(await getUser(phone), 200);
    } catch (error) {
        if (error.message == "User not found") return returnResponseHelper({ error: error.message }, 404);
        return returnResponseHelper({ error: error.message }, 500);
    }
};