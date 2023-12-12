'use strict';

jest.mock('../../../common/return-response.helper', () => ({
    returnResponseHelper: jest.fn().mockImplementation((result, statusCode) => {
        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'X-API-KEY',
            },
            body: JSON.stringify(result),
        };
    }),
}));
jest.mock('../service/getUser.service', () => ({
    getUser: jest.fn()
}));

const { returnResponseHelper } = require("../../../common/return-response.helper");
const { getUser } = require("../service/getUser.service");
const { handler } = require('../handler/getUser');

const validatePhoneNumber = jest.fn();

describe('getUser handler', () => {
    beforeEach(() => {
        returnResponseHelper.mockClear();
        getUser.mockClear();
        validatePhoneNumber.mockClear();
    });

    test('should return error for missing pathParameters', async () => {
        const event = {};
        const response = await handler(event);

        expect(returnResponseHelper).toHaveBeenCalledWith({ error: "Invalid pathparameter" }, 400);
        expect(response).toBeDefined();
    });

    test('should return error for missing phone in pathParameters', async () => {
        const event = { pathParameters: {} };
        const response = await handler(event);

        expect(returnResponseHelper).toHaveBeenCalledWith({ error: "Invalid phone" }, 400);
        expect(response).toBeDefined();
    });

    test('should return error for invalid phone number', async () => {
        validatePhoneNumber.mockReturnValue(false);
        const event = { pathParameters: { phone: 'invalid' } };
        const response = await handler(event);

        expect(returnResponseHelper).toHaveBeenCalledWith(expect.anything(), 400);
        expect(response).toBeDefined();
    });

    test('should return user for valid phone number', async () => {
        validatePhoneNumber.mockReturnValue(true);
        const mockUser = { name: 'Test User', phone: '+5521987654321' };
        getUser.mockResolvedValue(mockUser);
        const event = { pathParameters: { phone: mockUser.phone } };

        const response = await handler(event);

        expect(getUser).toHaveBeenCalledWith(mockUser.phone);
        expect(returnResponseHelper).toHaveBeenCalledWith(mockUser, 200);
        expect(response).toBeDefined();
    });

    test('should return 404 error when user is not found', async () => {
        validatePhoneNumber.mockReturnValue(true);
        const error = new Error("User not found");
        getUser.mockRejectedValue(error);
        const event = { pathParameters: { phone: '+5521987654321' } };

        const response = await handler(event);

        expect(getUser).toHaveBeenCalledWith(expect.any(String));
        expect(returnResponseHelper).toHaveBeenCalledWith({ error: error.message }, 404);
        expect(response).toBeDefined();
    });

    test('should return 500 error on unexpected errors', async () => {
        validatePhoneNumber.mockReturnValue(true);
        const error = new Error("Unexpected error");
        getUser.mockRejectedValue(error);
        const event = { pathParameters: { phone: '+5521987654321' } };

        const response = await handler(event);

        expect(getUser).toHaveBeenCalledWith(expect.any(String));
        expect(returnResponseHelper).toHaveBeenCalledWith({ error: error.message }, 500);
        expect(response).toBeDefined();
    });
});
