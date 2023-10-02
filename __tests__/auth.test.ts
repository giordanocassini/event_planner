import request from 'supertest';
import { app } from '../src/index'; // Adjust the path to your Express app
import UserDbService from '../src/services/UserDbService'; // Import UserDbService for mocking

describe('Authentication Route Tests', () => {

  const userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    name: "Jane Doe",
  };
  
  const userInput = { email: 'joazinho2@email.com', password: '123456' };

  it('should return 200 and a token for valid login', async () => {
    const createUserServiceMock = jest
          .spyOn(UserDbService.getInstance(), "findUserByEmail")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

    const response = await request(app).post('/login').send(userInput); // Provide valid credentials

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
