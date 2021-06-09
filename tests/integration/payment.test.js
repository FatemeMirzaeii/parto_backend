
const request = require('supertest');
const { user, transaction, bank_receipt, invoice, service, wallet,user_log } = require("../models");

describe('payment', () => {
    let usr;
    let server;
    let token;
    let userId;
    
    beforeAll(async()=>{
        usr =await user.create({name:"zahra", email:"payment@gmail.com",phone:"09125454219"});
        token =usr.generateAuthToken();
        userId=usr.id;
        
    })
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

    describe('POST - /v1/purchase/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        const exec=()=>{
           return request(server).get('/cycle/getLastPeriodDate/'+tempUserId+'/fa')
           .set('x-auth-token', tempToken);
        }
        
        it('return 200 if every things be ok',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });

        it('return 404 if information not found',async () => {
            let newUser =await user.create({name:"zahra", email:"newcycle_zzdand7755@gmail.com",phone:"09125454210"});
            tempToken = await newUser.generateAuthToken();
            tempUserId=await newUser.id;
            const result=await exec(); 
            await newUser.destroy();
            expect(result.status).toBe(404);
            
        });
    });

    describe('POST - /v1/verifyPurchase/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).put('/cycle/editLastPeriodDate/'+tempUserId+'/2020-02-02/fa').set('x-auth-token', tempToken);
        }

        it('return 400 if resive inavalid intery',async () => {
            tempToken=token;
            tempUserId=userId+100;
            const result=await exec(); 
            expect(result.status).toBe(400);
        });
        it('return 200 if every things ok',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
        });
    });

    describe('GET - /v1/credit/:userId/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        
        const exec=()=>{
           return request(server).put('/cycle/setBleedingDays/'+tempUserId+'/fa')
           .send({"deleteDate":[],"addDate":["2022-08-10","2020-08-10"]})
           .set('x-auth-token', tempToken);
        }
        
        it('return 200 if every things ok',async () => {
            tempToken=token;
            tempUserId=userId;
            //console.log("us",tempUserId);
            const result=await exec(); 
            expect(result.status).toBe(200);
        });
    });

    describe('GET - /v1/services/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        
        const exec=()=>{
            return request(server).get('/cycle/getUserAllPeriodDays/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }
           
        it('return 200 if every things ok',async () => {
            tempToken=token;
            tempUserId=userId;
            const addOption=await user_tracking_option.create({date: "2020-01-01",tracking_option_id:2 });
            await addOption.setUser(usr);   
            let result=await exec(); 
            expect(result.status).toBe(200);
        });

        // it('return 404 if information not found',async () => {
        //     let nUser =await user.create({name:"zahra", email:"newcycle_zzdand7755@gmail.com",phone:"09125454218"});
        //     tempToken =nUser.generateAuthToken();
        //     tempUserId=nUser.id;
        //     let result=await exec(); 
        //     await nUser.destroy()
        //     expect(result.status).toBe(404);
        // });
        
    });

    describe('GET - /v1/:userId/accountHistory/:lang', () => {
        let tempToken=token;
        let tempUserId=userId;
        
        const exec=()=>{
            return request(server).get('/payment/v1/'+tempUserId+'/accountHistory/fa').set('x-auth-token', tempToken);
        }
         
        it('return 400 if information invalid',async () => {
            tempUserId = userId + 100;
            TempToken = token;
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it('return 404 if information not found',async () => {
            let nUser =await user.create({name:"zahra", email:"newPayment@gmail.com",phone:"09125454218"});
            tempToken =nUser.generateAuthToken();
            tempUserId=nUser.id;
            let result=await exec(); 
             await user_log.destroy({where: {user_id:userId}});
            await nUser.destroy()
            expect(result.status).toBe(404);
        });

        it('return 200 if every things ok',async () => {
            tempToken=token;
            tempUserId=userId;
            const addOption=await user_tracking_option.create({date: "2020-01-01",tracking_option_id:2 });
            await addOption.setUser(usr);   
            let result=await exec(); 
            expect(result.status).toBe(200);
        });

        
        
    });

    
});