
module.exports.validatePhoneNumber = (phoneNumber) => {
    var regex = /^\+553[1-9]\d{8}$/;
    return regex.test(phoneNumber);
}
