const request = require('supertest');
const { user,user_log} = require("../../models");

describe('user', () => {
    let usr;
    let server;
    let token;
    let userId;
    let partnerCode;
    beforeAll(async()=>{
        usr =await user.create({name:"zahra", email:"user_zzdand7755@gmail.com",phone:"09125454218"});
        token =usr.generateAuthToken();
        userId=usr.id;
    });
    beforeEach(async() => { 
        server=require('../../development');
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
        let userLog=await user_log.findOne({where: {user_id:userId}});
        await userLog.destroy();
        await usr.destroy();
    });

    // describe('parseCode(partnerCode)', () => {
    //     it('should equal ',async () => {
    //         const result=partnerCode("PRT-2128-23"); 
    //         console.log("resultt",result.text);
    //         expect(result.text).toBe(200);
    //         // partnerCode=((result.text).split("\"")[5]).toString();
            
    //     });
    // });

    describe('/get- partnerVerificationCode/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).get('/user/'+tempUserId+'/partnerVerificationCode/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            console.log("ppp",result.body.data.partnerCode);
            partnerCode=result.body.data.partnerCode;
        });
    });

    describe('/post- partnerVerificationCode/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        let tempPartnerCode=partnerCode;
        const exec=()=>{
           return request(server).post('/user/'+tempUserId+'/partnerVerificationCode/fa')
           .send({"partnerCode":`${tempPartnerCode}`})
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            let partner =await user.create({name:"zahra", email:"tempUser_zzdand7755@gmail.com",phone:"09125454218"});
            tempToken =partner.generateAuthToken();
            tempUserId=partner.id;
            tempPartnerCode=partnerCode;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

        it('return 400 ',async () => {
            tempPartnerCode=partnerCode+"2";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });

        it('return 400 ',async () => {
            tempPartnerCode="";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });

        // it('return 404 ',async () => {
        //     tempPartnerCode="";
        //     const result=await exec(); 
        //     expect(result.status).toBe(400);
        // });
    });

    describe('/post-user/versionType/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        let type;
        const exec=()=>{
           return request(server).post('/user/'+tempUserId+'/versionType/fa')
           .send({"type":`${type}`})
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            type="Teenager";
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

        it('return 400 ',async () => {
            tempToken=token;
            tempUserId=userId;
            type="Partners";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });

        it('return 400 ',async () => {
            tempToken=token;
            tempUserId=userId;
            type="";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });
    });

    describe('/put-user/versionType/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        let type;
        const exec=()=>{
           return request(server).put('/user/'+tempUserId+'/versionType/fa')
           .send({"type":`${type}`})
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            type="Main";
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

        it('return 400 ',async () => {
            tempToken=token;
            tempUserId=userId;
            type="partner";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });

        it('return 400 ',async () => {
            tempToken=token;
            tempUserId=userId;
            type="";
            const result=await exec(); 
            expect(result.status).toBe(400);
        });
    });
    
    describe('/get-user/versionType/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).get('/user/'+tempUserId+'/versionType/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

    });

    describe('/PUT-user/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).put('/user/'+tempUserId+'/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

    });

    describe('/DELETE-user/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).delete('/user/'+tempUserId+'/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

    });

        
});