import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app
import UserDbService from '../services/UserDbService';

const userDbService: UserDbService = UserDbService.getInstance();

describe('Authentication Route Tests', () => {
  const userPayload = {
    user: {},
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjk2Mjc3NTM0LCJleHAiOjE2O',
  };

  const userInput = { email: 'joazinho2@email.com', password: "123456" };

  it('should return 200 and a token for valid login', async () => {
    const createUserServiceMock = jest
      .spyOn(userDbService, 'findByEmail')
      // @ts-ignore
      .mockReturnValueOnce(userPayload);

    const response = await request(app).post('/login').send(userInput); // Provide valid credentials

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
  });
});
