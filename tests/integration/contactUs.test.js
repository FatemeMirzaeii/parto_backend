const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('contactUs', () => {
    let server=require('../../development');
    describe('/Email', () => {
        let email="zzand7755@gmail.com";
        const exec=()=>{
           return request(server).post('/contactUs/email')
           .send({"name":"zahra","email":`${email}`,"message":"صرفا براي تست","title":"تست ايميل كاربر"});
        }
        

        it('return 200',async () => {
            const result=await exec(); 
            expect(result.status).toBe(200);
            server.close();
            // jest.setTimeout(2*60*1000)
            // await new Promise(res => setTimeout(() => {
            //     console.log("Why don't I run?")
            //     expect(true).toBe(true)
            //     res()
            //   }, 2*60*1000))
        });

    });
});