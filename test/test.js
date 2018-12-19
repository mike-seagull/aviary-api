const request = require('supertest');
const app = require('../app')
describe('Test Status Codes', () => {
    test('Heartbeat', async () => {
        const resp = await request(app).get('/api/heartbeat');
        expect(resp.statusCode).toBe(200);
        expect(resp.text).toBe("BOO-BUM")
    });
    if (!global.__IS_REMOTE__) { // can only be tested locally
        test('CouchPotato', async () => {
            let resp = await request(app).get('/api/couch');
            expect(resp.statusCode).toBe(400);
            resp = await request(app).get('/api/couch?title=blah');
            expect(resp.statusCode).toBe(200)
            resp = await request(app).get('/api/couch/status')
            expect(resp.statusCode).toBe(200)
            resp = await request(app).post('/api/couch')
            expect(resp.statusCode).toBe(400)
        })
    }
})