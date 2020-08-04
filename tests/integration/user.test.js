const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { user } = require("../../models");
const bcrypt = require("bcrypt");

describe("/user/signUp/:lang", () => {
    let server;
    let email='user_zzand7755@gmail.com';
    let User;
    let imei='12345678901234';

    const exec=()=>{
         const res= request(server).post('/user/signUp/fa').send({"name":"zahra","email":`${email}`,"password":"11111111",imei:`${imei}`});
         return res;
    }
    beforeEach(()=>{
        server=require('../../app');
       
    })
    afterEach(async()=>{
        server.close();
    })
    it('return 400 if email address exist ',async()=>{
        User =await user.create({name:"zahra", email:"user_zzand7755@gmail.com" , imei:"12312312345678"});
        const result=await exec();
        expect(result.status).toBe(400);
        await User.destroy();
    })
    it('return 400 if imei is not exist ',async()=>{
        imei='';
        const result=await exec();
        expect(result.status).toBe(400);
        
    })

    it('return 200 if email address not exist and creat new user and send token to user',async()=>{
        const result=await exec();
        expect(result.status).toBe(200);
        expect(result.body.data.id).not.toBeNull();
        const hash = await bcrypt.hash("11111111", 10);
        User=await user.destroy({
            where: {
              id:result.body.data.id
            }
        });
        
    })
    
})