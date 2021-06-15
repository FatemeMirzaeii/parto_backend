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

    describe('/get-partnerVerificationCode/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).get('/user/partnerVerificationCode/'+tempUserId+'/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            partnerCode=((result.text).split("\"")[5]).toString();
            
        });

        it('return 400 ',async () => {
            let tempUsr =await user.create({name:"zahra", email:"tempUser_zzdand7755@gmail.com",phone:"09125454218"});
            tempToken =tempUsr.generateAuthToken();
            tempUserId=tempUsr.id;
            await tempUsr.destroy();
            const result=await exec(); 
            expect(result.status).toBe(400);
        });
    });

    describe('/post-partnerVerificationCode/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        let tempPartnerCode=partnerCode;
        const exec=()=>{
           return request(server).post('/user/partnerVerificationCode/'+tempUserId+'/fa')
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
    });

    describe('/post-user/versionType/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        let type;
        const exec=()=>{
           return request(server).post('/user/versionType/'+tempUserId+'/fa')
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
           return request(server).put('/user/versionType/'+tempUserId+'/fa')
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
            type="Partner";
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
           return request(server).get('/user/versionType/'+tempUserId+'/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

        it('return 400 ',async () => {
            let tempUsr =await user.create({name:"zahra", email:"tempUser_zzdand7755@gmail.com",phone:"09125454218"});
            tempToken =tempUsr.generateAuthToken();
            tempUserId=tempUsr.id;
            await tempUsr.destroy();
            const result=await exec(); 
            expect(result.status).toBe(400);
        });
    });

        
});