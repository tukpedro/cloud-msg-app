'use strict';

jest.mock('@aws-sdk/client-dynamodb', () => {
    const sendMock = jest.fn();
    return {
        DynamoDBClient: jest.fn().mockImplementation(() => ({
            send: sendMock
        })),
        QueryCommand: jest.fn(),
        sendMock
    };
});

jest.mock('@aws-sdk/util-dynamodb', () => ({
    marshall: jest.fn().mockImplementation(data => data),
    unmarshall: jest.fn().mockImplementation(data => data)
}));


const { DynamoDBClient, QueryCommand, sendMock } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { getUser } = require('./getUser.service');

describe('getUser service', () => {
    const mockPhone = '+5521987654321';
    const mockUser = { phone: mockPhone, name: 'Test User' };
    const mockResponse = { Items: [mockUser] };

    beforeEach(() => {
        DynamoDBClient.mockClear();
        QueryCommand.mockClear();
        marshall.mockClear();
        unmarshall.mockClear();
        sendMock.mockClear();

        jest.spyOn(console, 'info').mockImplementation(() => { });
    });

    afterEach(() => {
        console.info.mockRestore();
    });

    test('should return user when found in DynamoDB', async () => {
        sendMock.mockResolvedValue(mockResponse);
        unmarshall.mockImplementation(data => data);

        const result = await getUser(mockPhone);

        expect(marshall).toHaveBeenCalledWith({ ':phone': mockPhone });
        expect(sendMock).toHaveBeenCalledWith(expect.any(QueryCommand));
        expect(result).toEqual(mockUser);
    });

    test('should return false when user is not found in DynamoDB', async () => {
        sendMock.mockResolvedValue({ Items: [] });

        const result = await getUser(mockPhone);

        expect(result).toBe(false);
    });

    test('should return false on DynamoDB query error', async () => {
        const mockError = new Error('DynamoDB Query Error');
        sendMock.mockRejectedValue(mockError);

        const result = await getUser(mockPhone);

        expect(result).toBe(false);
        expect(console.info).toHaveBeenCalledWith('DynamoDB Query Error', mockError);
    });
});
