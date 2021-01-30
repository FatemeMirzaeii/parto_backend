const request = require('supertest');
const { user ,user_log, verification_code} = require("../../models");
const bcrypt = require("bcrypt");
let server;

describe('auth',()=>{

    let UserEmail;
    let UserPhone;
    let email="auth_zzand7755@gmail.com";
    let phone="09199698080";
    let password="11111111";
    let newUser;
        
    beforeAll(async()=>{
        const hash = await bcrypt.hash(password, 10);
        newUser=await user.create({
          name: "zahra",
          email: email,
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
        let userLog=await user_log.findOne({where: {user_id:UserPhone.id}});
        await userLog.destroy();
        await newUser.destroy();
        
    })
    
    // describe("/signIn/:lang",()=>{
        
    //     // const execEmail=()=>{
    //     //    const res= request(server).post('/auth/signIn/fa')
    //     //     .send({"name":"zahra","email":`${email}`,"phone":"","password":`${password}`});
    //     //     return res;
    //     // }
    //     // const execPhone=()=>{
    //     //     const res= request(server).post('/auth/signIn/fa')
    //     //      .send({"name":"zahra","phone":`${phone}`});
    //     //      return res;
    //     //  }

    //     // it('return 400 if email is not exist or invalid',async()=>{
    //     //     email='bbzand@gmail.com';
    //     //     phone='';
    //     //     const result=await execEmail();
    //     //     expect(result.status).toBe(400);
    //     // });

    //     // it('return 400 if phone is not exist or invalid',async()=>{
    //     //     phone='09028884422';
    //     //     email="";
    //     //     const result=await execPhone();
    //     //     expect(result.status).toBe(400);
                    
    //     // });

    //     // it('return 400 if password is not correct',async()=>{
    //     //     email='auth_zzand7755@gmail.com';
    //     //     password='zzbb111';
    //     //     const result=await execEmail();
    //     //     expect(result.status).toBe(400);
            
    //     // });

    //     // it('return 400 if password is not correct',async()=>{
    //     //     phone='09199698086';
    //     //     password='zzbb111';
    //     //     const result=await execPhone();
    //     //     expect(result.status).toBe(400);
    //     // });

    //     // it('return 200 if every thing be ok and send token and id for user',async()=>{
    //     //     email=UserEmail.email;
    //     //     password='11111111';
    //     //     const result=await execEmail();
    //     //     expect(result.status).toBe(200);
    //     //     expect(result.body.data.id).toBe(UserEmail.id);
    //     //     User_log=await user_log.findOne({where: {user_id:newUser.id}});
    //     //     User_log.destroy();
            
    //     // })
    //     // it('return 200 if every thing be ok and send token and id for user',async()=>{
    //     //     //email='';
    //     //     phone=UserPhone.phone;
    //     //     //password='11111111';
    //     //     const result=await execPhone();
    //     //     expect(result.status).toBe(200);
    //     //     expect(result.body.data.id).toBe(UserPhone.id);
    //     //     let User_log=await user_log.findOne({where: {user_id:newUser.id}});
    //     //     await User_log.destroy();
    //     // })
    // });

    // describe("/verificationCode",()=>{
    // })

    describe('/logIn',()=>{
        let phone;
        const exec=()=>{
            return request(server).post('/auth/logIn/fa')
             .send({"name":"zahra","phone":`${phone}`});
            
        }

        it('400',async()=>{
            phone="";
            const result=await exec();
            expect(result.status).toBe(400);
            //await new Promise(resolve => setTimeout(resolve, 2000));
            
        });

        it('200',async()=>{
            phone="09199698080";
            const result=await exec();
            expect(result.status).toBe(200);
        });

    })
    // describe('/verificationCode',async()=>{
    //     let phone;
    //     const exec=()=>{
    //         return request(server).post('/auth/verificationCode')
    //          .send({"phone":`${phone}`});
    //     }

        // it('400',async()=>{
        //     phone="99199698086";
        //     const result=await exec();
        //     expect(result.status).toBe(400);
        // });
        
        // it('200',async()=>{
        //     phone="09199698086";
        //     const result=await exec();
        //     expect(result.status).toBe(200);
        // });

        // it('409',async()=>{
        //     phone="09199698086";
        //     const result=await exec();
        //     expect(result.status).toBe(409);
        // });
    // })

    // describe('/checkVerificationCode',async()=>{
    //     let phone;
    //     let code;
       
    //     const exec=()=>{
    //         return request(server).post('/auth/checkVerificationCode/fa')
    //          .send({"phone":`${phone}`,"code":`${code}`});
    //     }
        // it('400',async()=>{
        //     phone="09199698086";
        //     code="9"
        //     const result=await exec();
        //     expect(result.status).toBe(400);
        // });
               
        // it('408',async()=>{
        //     jest.setTimeout(3*60*1000)
        //     await new Promise(res => setTimeout(() => {
        //         console.log("Why don't I run?")
        //         expect(true).toBe(true)
        //         res()
        //       }, 2.5*60*1000))
        //     phone="09199698086";
        //     let userExist = await verification_code.findOne({
        //         where: {
        //           phone: "09199698086",
        //         }
        //       });
        //     code=userExist.code;
        //     const result=await exec();
        //     expect(result.status).toBe(408);
        // });
        // it('200',async()=>{
        //     await request(server).post('/auth/verificationCode').send({"phone":`${phone}`});
        //     let userExist = await verification_code.findOne({
        //         where: {
        //           phone: "09199698086",
        //         }
        //       });
        //     phone="09199698086";
        //     code=userExist.code;
        //     const result=await exec();
        //     expect(result.status).toBe(200);
           
        // });
    // })
})
