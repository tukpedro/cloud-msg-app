const returnResponseHelper = require("../../../common/return-response.helper");
const { createUser } = require("../service/createUser.service");

module.exports.handler = async event => {
    const { body } = event;

    if (!body) return returnResponseHelper({ error: "Body is empty" }, 400);

    const parsedBody = JSON.parse(body);

    return returnResponseHelper(await createUser(parsedBody), 201);
};