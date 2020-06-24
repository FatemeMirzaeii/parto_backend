const request = require('supertest');
const { user } = require("../../models");
const bcrypt = require("bcrypt");

describe("/user/signUp/:lang", () => {
    let server;
    let email='zzand7755@gmail.com';
    let User;

    const exec=()=>{
         const res= request(server).post('/user/signUp/fa').send({"name":"zahra","email":`${email}`,"password":"11111111"});
         return res;
    }
    beforeEach(()=>{
        server=require('../../app');
       
    })
    afterEach(async()=>{
       await server.close();
    })
    it('return 400 if email address exist ',async()=>{
        User =await user.create({name:"zahra", email:"zzand7755@gmail.com"});
        const result=await exec();
        await expect(result.status).toBe(400);
        await User.destroy();
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