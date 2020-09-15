const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { user ,user_log} = require("../../models");
const bcrypt = require("bcrypt");
let server;

describe('auth',()=>{

    let UserEmail;
    let UserPhone;
    let email="auth_zzand7755@gmail.com";
    let phone="09199698086";
    let password="11111111";
    let newUser;
        
    beforeAll(async()=>{
        const hash = await bcrypt.hash(password, 10);
        newUser=await user.create({
          name: "zahra",
          //email: email,
          phone: phone
          //password: hash
        });
        //UserEmail= await user.findOne({ where: {email: email} });
        UserPhone=await user.findOne({ where: {phone: phone} });
        
    });
    beforeEach(async()=>{
        server= require('../../development');
    })
    afterEach(async()=>{
        server.close();
    })
    afterAll(async()=>{
        await newUser.destroy();
        
    })
    
    describe("/signIn/:lang",()=>{
        
        // const execEmail=()=>{
        //    const res= request(server).post('/auth/signIn/fa')
        //     .send({"name":"zahra","email":`${email}`,"phone":"","password":`${password}`});
        //     return res;
        // }
        const execPhone=()=>{
            const res= request(server).post('/auth/signIn/fa')
             .send({"name":"zahra","phone":`${phone}`});
             return res;
         }

        // it('return 400 if email is not exist or invalid',async()=>{
        //     email='bbzand@gmail.com';
        //     phone='';
        //     const result=await execEmail();
        //     expect(result.status).toBe(400);
        // });

        it('return 400 if phone is not exist or invalid',async()=>{
            phone='09028884422';
            email="";
            const result=await execPhone();
            expect(result.status).toBe(400);
                    
        });

        // it('return 400 if password is not correct',async()=>{
        //     email='auth_zzand7755@gmail.com';
        //     password='zzbb111';
        //     const result=await execEmail();
        //     expect(result.status).toBe(400);
            
        // });

        // it('return 400 if password is not correct',async()=>{
        //     phone='09199698086';
        //     password='zzbb111';
        //     const result=await execPhone();
        //     expect(result.status).toBe(400);
        // });

        // it('return 200 if every thing be ok and send token and id for user',async()=>{
        //     email=UserEmail.email;
        //     password='11111111';
        //     const result=await execEmail();
        //     expect(result.status).toBe(200);
        //     expect(result.body.data.id).toBe(UserEmail.id);
        //     User_log=await user_log.findOne({where: {user_id:newUser.id}});
        //     User_log.destroy();
            
        // })
        it('return 200 if every thing be ok and send token and id for user',async()=>{
            //email='';
            phone=UserPhone.phone;
            //password='11111111';
            const result=await execPhone();
            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(UserPhone.id);
            let User_log=await user_log.findOne({where: {user_id:newUser.id}});
            User_log.destroy();
        })
    });

    describe("/verifyCode",()=>{

    })
    

})
