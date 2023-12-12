
module.exports.validatePhoneNumber = (phoneNumber) => {
    var regex = /^\+55(1[1-9]|[2-8][0-9])9\d{8}$/;
    return regex.test(phoneNumber);
}
