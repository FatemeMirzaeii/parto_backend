const request = require('supertest');
const { user, user_log, verification_code } = require("../../models");
const bcrypt = require("bcrypt");
let server;

describe('auth', () => {

    let email = "auth_zzand7755@gmail.com";
    let phone = "989199698080";
    let password = "11111111";
    let newUser;
    let hash;
    beforeAll(async () => {
        hash = await bcrypt.hash(password, 10);
        newUser = await user.create({
            email: email,
            phone: phone,
            password: hash
        });
    });
    beforeEach(async () => {
        server = require('../../development');
    })
    afterEach(async () => {
        server.close();
    })
    afterAll(async () => {
        let userLog = await user_log.findOne({ where: { user_id: newUser.id } });
        await userLog.destroy();
        await newUser.destroy();

    })

    // describe("POST-/signIn/:lang", () => {
    //     let tempPhone;
    //     let tempEmail;
    //     let tempVersion;
    //     let tempPass;

    //     const exec = () => {
    //         return request(server).post('/auth/signIn/fa')
    //             .send({ "phone": `${tempPhone}`, "email": `${tempEmail}`, "password": `${tempPass}`, "version": `${tempVersion}` });
    //     }

    //     it('return 400 if input are null ', async () => {
    //         tempEmail = "";
    //         tempPhone = "";
    //         tempVersion = null;
    //         tempPass = null;
    //         const result = await exec();
    //         expect(result.status).toBe(400);

    //     });

    //     it('return 400 if email is not correct', async () => {
    //         tempPhone = ""
    //         tempEmail = "zzand.com";
    //         tempPass = "zasffn,kol.";
    //         tempVersion = "android";
    //         const result = await exec();
    //         expect(result.status).toBe(400);
    //     });

    //     it('return 404 if user not found with email and password', async () => {
    //         tempPhone = ""
    //         tempEmail = "zzand7755@gmail.com";
    //         tempPass = "zasffn,kol.nkjnm";
    //         tempVersion = "android";
    //         const result = await exec();
    //         expect(result.status).toBe(404);
    //     });

    //     it('return 400 if phone is not correct', async () => {
    //         tempPhone = "0919979808"
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(400);

    //     });
    //     it('return 404 if user not found with phone', async () => {
    //         tempPhone = "989199698000"
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(404);
    //     });

    //     it('return 200 ', async () => {
    //         tempPhone = "";
    //         tempEmail = email;
    //         tempPass = hash;
    //         tempVersion = "android";
    //         const result = await exec();
    //         expect(result.status).toBe(200);
    //         })

    //     it('return 200 if every thing be ok and send token and id for user', async () => {
    //         tempPhone = phone;
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(200);
    //         })

    // });

    // describe("POST-/signUp/:lang", () => {
    //     let tempPhone;
    //     let tempEmail;
    //     let tempVersion;
    //     let tempPass;

    //     const exec = () => {
    //         return request(server).post('/auth/signUp/fa')
    //             .send({ "phone": `${tempPhone}`, "email": `${tempEmail}`, "password": `${tempPass}`, "version": `${tempVersion}` });
    //     }

    //     it('return 400 if input are null ', async () => {
    //         tempEmail = "";
    //         tempPhone = "";
    //         tempVersion = null;
    //         tempPass = null;
    //         const result = await exec();
    //         expect(result.status).toBe(400);

    //     });

    //     it('return 400 if phone is not correct', async () => {
    //         tempPhone = "0919979808"
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(400);

    //     });
    //     it('return 409 if userexist with phone', async () => {
    //         tempPhone = phone;
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(409);
    //     });
    //     it('return 400 if email is not correct', async () => {
    //         tempPhone = ""
    //         tempEmail = "zzand.com";
    //         tempPass = "zasffn,kol.";
    //         tempVersion = "android";
    //         const result = await exec();
    //         expect(result.status).toBe(400);
    //     });

    //     it('return 409 if user exist with email and password', async () => {
    //         tempPhone = ""
    //         tempEmail = email;
    //         tempPass = hash;
    //         tempVersion = "android";
    //         const result = await exec();
    //         expect(result.status).toBe(409);


    //     });

    //     it('return 200 ', async () => {

    //         tempPhone = "";
    //         tempEmail = "new_auth@gmail.com";
    //         tempPass = "zzzz.derfc.,huhyh$mnkm,k";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         expect(result.status).toBe(200);
    //             })

    //     it('return 200 if every thing be ok and send token and id for user', async () => {
    //         tempPhone = "989105454213";
    //         tempEmail = "";
    //         tempPass = "";
    //         tempVersion = "PWA";
    //         const result = await exec();
    //         console.log("rrrrrrrr",result);
    //         expect(result.status).toBe(200);
    //         })

    // });

    // describe("PUT-/forgetPassword/:lang", () => {
    //     let tempEmail;
    //     let tempNewPass;

    //     const exec = () => {
    //         return request(server).put('/auth/forgetPassword/fa')
    //             .send({ "email": `${tempEmail}`, "newPassword": `${tempNewPass}` });
    //     }

    //     it('return 400 if input are null ', async () => {
    //         tempEmail = "";
    //         tempNewPass = null;
    //         const result = await exec();
    //         expect(result.status).toBe(400);
    //     });

    //     it('return 400 if email is not correct', async () => {
    //         tempEmail = "zzand.com";
    //         tempNewPass = "zasffn,kol.";
    //         const result = await exec();
    //         expect(result.status).toBe(400);
    //     });

    //     it('return 404 if user not found with email and password', async () => {
    //         tempEmail = "zzand7755@gmail.com";
    //         tempNewPass = "zasffn,kol.nkjnm";
    //         const result = await exec();
    //         expect(result.status).toBe(404);


    //     });

    //     it('return 200 ', async () => {
    //         hash = await bcrypt.hash("password", 10);
    //         tempEmail = "auth_zzand7755@gmail.com";
    //         tempNewPass = hash;
    //         const result = await exec();
    //         expect(result.status).toBe(200);
    //     })
    // });

    describe("PUT-/changePassword/:lang", () => {
        let tempEmail;
        let tempNewPass;
        let tempPass;

        const exec = () => {
            return request(server).put('/auth/changePassword/fa')
                .send({ "email": `${tempEmail}`, "password": `${tempPass}`, "newPassword": `${tempNewPass}` });
        }

        // it('return 400 if input are null ', async () => {
        //     jest.setTimeout(3 * 60 * 1000)
        //     await new Promise(res => setTimeout(() => {
        //         console.log("Why don't I run?")
        //         expect(true).toBe(true)
        //         res()
        //     }, 2.5 * 60 * 1000))
        //     tempEmail = "";
        //     tempNewPass = null;
        //     tempPass = "";
        //     const result = await exec();
        //     expect(result.status).toBe(400);
        // });

        it('return 400 if email is not correct', async () => {
            tempEmail = "zzand.com";
            tempNewPass = "zasffn,kol.";
            tempPass = hash;
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it('return 404 if user not found with email and password', async () => {
            tempEmail = "zzand7755@gmail.com";
            tempPass = "zasffn,kol.nkjnm";
            tempNewPass = "bxashjbzjxahikx,hxsuajnx.kxjasikjx";
            const result = await exec();
            expect(result.status).toBe(404);
        });

        it('return 200 ', async () => {
            tempEmail = "auth_zzand7755@gmail.com";
            tempPass = hash;
            tempNewPass = "bxashjbzjxahikx,hxsuajnx.kxjasikjx";
            const result = await exec();
            expect(result.status).toBe(200);
        })
    });

    describe("POST- /v2/verificationCode", () => {
        let tempPhone;
        let tempEmail;

        const execEmail = () => {
            return request(server).post('/auth/v2/verificationCode/fa')
                .send({ "email": `${tempEmail}`, "type": "lock" });
        }

        const execPhone = () => {
            return request(server).post('/auth/v2/verificationCode/fa')
                .send({ "phone": `${tempPhone}` });
        }
        it('return 400 if phone is null ', async () => {
            tempPhone = "";
            const result = await execPhone();
            expect(result.status).toBe(400);
        });

        it('return 400 if email is null ', async () => {
            tempEmail = "";
            const result = await execEmail();
            expect(result.status).toBe(400);
        });
        // heare we have 502 error if return 502 we have problem in sms center or email center 
        it('return 200 if sms send corectly', async () => {
            tempPhone = "989199698086";
            const result = await execPhone();
            expect(result.status).toBe(200);
        });
        it('return 409  ', async () => {
            tempPhone = "989109698080";
            await verification_code.create({
                where: {
                    phone: "989109698080",
                    code:"1234",
                    type:"login"
                }
            });
            const result = await execPhone();
            expect(result.status).toBe(409);
        });
        it('return 200 if email send corectly', async () => {
            tempEmail = "zzand7755@gmail.com";
            const result = await execEmail();
            expect(result.status).toBe(200);
        });
        
    })

    describe("POST- /v2/checkVerificationCode", () => {
        let tempPhone;
        let tempEmail;
        let tempCode;
        const execEmail = () => {
            return request(server).post('/auth/v2/checkVerificationCode/fa')
                .send({ "email": `${tempEmail}`, "code": `${tempCode}`, "type": "lock" });
        }

        const execPhone = () => {
            return request(server).post('/auth/v2/checkVerificationCode/fa')
                .send({ "phone": `${tempPhone}`, "code": `${tempCode}` });
        }
        it('return 400 if phone is null ', async () => {
            tempPhone = "";
            tempCode = "";
            const result = await execPhone();
            expect(result.status).toBe(400);
        });

        it('return 400 if email is null ', async () => {
            tempEmail = "";
            tempCode = "";
            const result = await execEmail();
            expect(result.status).toBe(400);
        });

        it('400', async () => {
            tempPhone = "989129698086";
            await request(server).post('/auth/v2/verificationCode').send({ "phone": `${tempPhone}` });
            tempCode = "9"
            const result = await execPhone();
            expect(result.status).toBe(400);
        });

        it('200 if send sms corect and code was true', async () => {
            tempPhone = "989139698086";
            await request(server).post('/auth/v2/verificationCode').send({ "phone": `${tempPhone}` });
            let userExist = await verification_code.findOne({
                where: {
                    phone: "989139698086",
                    type:"login"
                }
            });
            
            tempCode = userExist.code;
            const result = await execPhone();
            expect(result.status).toBe(200);
        });
        it('200 if send email corect and code was true', async () => {
            tempEmail = "chevkverification@gmail.com";
            await request(server).post('/auth/v2/verificationCode').send({ "email": `${tempEmail}`, "type": "lock" });
            let userExist = await verification_code.findOne({
                where: {
                    email: tempEmail,
                    type:"lock"
                }
            });
            console.log("ueeee",userExist);
            tempCode = userExist.code;
            const result = await execEmail();
            expect(result.status).toBe(200);
        });

        it('408', async () => {
            jest.setTimeout(3 * 60 * 1000)
            await new Promise(res => setTimeout(() => {
                console.log("Why don't I run?")
                expect(true).toBe(true)
                res()
            }, 2.5 * 60 * 1000))
            tempPhone = "989199698086";
            let userExist = await verification_code.findOne({
                where: {
                    phone: "989199698086",
                    type:"login"
                }
            });
            code = userExist.code;
            const result = await execPhone();
            expect(result.status).toBe(408);
        });
    })
    // // describe('/logIn',()=>{
    // //     let phone;
    // //     const exec=()=>{
    // //         return request(server).post('/auth/logIn/fa')
    // //          .send({"name":"zahra","phone":`${phone}`});

    // //     }

    // //     it('400',async()=>{
    // //         phone="";
    // //         const result=await exec();
    // //         expect(result.status).toBe(400);
    // //         //await new Promise(resolve => setTimeout(resolve, 2000));

    // //     });

    // //     it('200',async()=>{
    // //         phone="09199698080";
    // //         const result=await exec();
    // //         expect(result.status).toBe(200);
    // //     });

    // // })
    // // describe('/verificationCode',async()=>{
    // //     let phone;
    // //     const exec=()=>{
    // //         return request(server).post('/auth/verificationCode')
    // //          .send({"phone":`${phone}`});
    // //     }

    // //     it('400',async()=>{
    // //         phone="99199698086";
    // //         const result=await exec();
    // //         expect(result.status).toBe(400);
    // //     });

    // //     it('200',async()=>{
    // //         phone="09199698086";
    // //         const result=await exec();
    // //         expect(result.status).toBe(200);
    // //     });

    // //     it('409',async()=>{
    // //         phone="09199698086";
    // //         const result=await exec();
    // //         expect(result.status).toBe(409);
    // //     });
    // // })

    // // describe('/checkVerificationCode',async()=>{
    // //     let phone;
    // //     let code;

    // //     const exec=()=>{
    // //         return request(server).post('/auth/checkVerificationCode/fa')
    // //          .send({"phone":`${phone}`,"code":`${code}`});
    // //     }
    // //     it('400',async()=>{
    // //         phone="09199698086";
    // //         code="9"
    // //         const result=await exec();
    // //         expect(result.status).toBe(400);
    // //     });

    // //     it('408',async()=>{
    // //         jest.setTimeout(3*60*1000)
    // //         await new Promise(res => setTimeout(() => {
    // //             console.log("Why don't I run?")
    // //             expect(true).toBe(true)
    // //             res()
    // //           }, 2.5*60*1000))
    // //         phone="09199698086";
    // //         let userExist = await verification_code.findOne({
    // //             where: {
    // //               phone: "09199698086",
    // //             }
    // //           });
    // //         code=userExist.code;
    // //         const result=await exec();
    // //         expect(result.status).toBe(408);
    // //     });
    // //     it('200',async()=>{
    // //         await request(server).post('/auth/verificationCode').send({"phone":`${phone}`});
    // //         let userExist = await verification_code.findOne({
    // //             where: {
    // //               phone: "09199698086",
    // //             }
    // //           });
    // //         phone="09199698086";
    // //         code=userExist.code;
    // //         const result=await exec();
    // //         expect(result.status).toBe(200);

    // //     });
    // // })
})
