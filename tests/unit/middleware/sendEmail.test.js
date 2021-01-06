require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const sendEmail = require('../../../middleware/sendEmail');
let server;

describe('send Email', () => {
    it('should return email info', async () => {
        server = require('../../../development');
        const subject = 'test';
        const text = 'test email in beckend';
        const result = await sendEmail('parto@parto.email', 'zzand7755@gmail.com', text, subject);
        expect(result).toContain('info  [object Object]   info.response  250 2.0.0 Ok: queued as');
    });
    afterAll(async () => {
        await server.close();

    });
});