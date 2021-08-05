require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const sendEmail = require('../../../middleware/sendEmail');
let server;

describe('send Email', () => {
    it('should return email info', async () => {
        jest.setTimeout(60*1000);
        server = require('../../../development');
        const subject = 'test';
        const text = 'test email in beckend';
        const result = await sendEmail('parto@parto.email', 'zzand7755@gmail.com', text, subject);
        console.log("rrrrrrrrr",result)
        expect(result).toBe(200);
    });
    afterAll(async () => {
        await server.close();

    });
});