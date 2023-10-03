import request from 'supertest';
import app from '../app'; // Adjust the path to your Express app
import UserDbService from '../services/UserDbService';
import { AuthController } from '../controllers/AuthController';
const userDbService: UserDbService = UserDbService.getInstance();

describe('Authentication Route Tests', () => {
  const userPayload = {
    email: 'joazinho2@email.com',
    password: 'hash',
  };

  const userInput = { email: 'joazinho2@email.com', password: '123456' };

  it('should return 200 and a token for valid login', async () => {
    const checkIfUnencryptedPasswordIsValidMock = jest.spyOn(AuthController, 'checkIfUnencryptedPasswordIsValid').mockImplementation((password, hashedPassword) => {
      return password === '123456' && hashedPassword === 'hash';
    });

    const createUserDbServiceMock = jest
      .spyOn(userDbService, 'findByEmail')
      // @ts-ignore
      .mockReturnValueOnce(userPayload);

    const response = await request(app).post('/login').send(userInput); // Provide valid credentials

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
