import { app } from '../../src/index';
import request from 'supertest';
import { AppDataSource } from '../../src/datasource';

describe('API Tests', () => {
  it('should fetch data from the database', async () => {
    const response = await request(app).get('/api/data'); // Replace with your API route

    // Assuming you have a JSON response, you can make assertions like this:
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Data fetched successfully' });
  });
});
