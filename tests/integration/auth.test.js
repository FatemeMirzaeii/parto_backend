// const request = require('supertest');
// const { user } = require("../../models");
// const bcrypt = require("bcrypt");
// const { Console } = require('winston/lib/winston/transports');

// describe('auth',()=>{

//     let server;
//     let User;
//     let email="z.zzand7755@gmail.com";
//     let password="11111111";
        
//     beforeAll(async()=>{
//         const hash = await bcrypt.hash(password, 10);
//         User= await user.create({
//           name: "zahra",
//           email: email,
//           password: hash,
//         });
//     })

//     beforeEach(()=>{
//         server=require('../../app');
       
//     })
//     afterEach(async()=>{
//        await server.close();
//     })
//     afterAll(async()=>{
//         await User.destroy();
//     })

//     describe("/signIn/:lang",()=>{
        
//         const exec=()=>{
//             return request(server).post('/auth/signIn/fa').send({"name":"zahra","email":`${email}`,"password":`${password}`});
//         }

//         it('return 400 if email is not exist or invalid',async()=>{
//             email="bbzand@gmail.com";
//             const result=await exec();
//             expect(result.status).toBe(400);
                    
//         });

//         it('return 400 if password is not correct',async()=>{
//             password="zzbb111";
//             const result=await exec();
//             expect(result.status).toBe(400);

//         });
//         it('return 200 if every thing be ok and send token and id for user',async()=>{
//             const result=await exec();
//             console.log(result);
//             expect(result.status).toBe(200);
//             expect(result.body.data.id).toBe(User.body.data.id);
//         })

//     })
//     describe("/forgotPassword",()=>{

//     })
//     describe("/changePassword",()=>{

//     })
//     describe("/sendVerificationCode",()=>{

//     })
    

// })