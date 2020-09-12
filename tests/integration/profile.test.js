const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { user_profile, user } = require("../../models");

describe('profile', () => {
    let server;
    let userId;
    let token;
    let uProfile;
    beforeAll(async()=>{
        newUser =await user.create({name:"zahra", email:"art_zzdand7755@gmail.com"});
        token = newUser.generateAuthToken();
        userId=newUser.id;
        uProfile = await user_profile.create({
            birthdate:new Date("1377-05-05"),
            avg_cycle_length:23,
            avg_period_length:7,
            avg_sleeping_hour:8,
            pms_length:3,
            height:158,
            weight:58,
            pregnant:false,
            pregnancy_try:false,
            use_lock:false,
            last_period_date:"1300-01-01"
        });
        await uProfile.setUser(newUser);
    })
    beforeEach(async() => { 
        server=require('../../app');
       
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
        await uProfile.destroy();
        await newUser.destroy();
        
    });

    describe('/profile/getProfile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).get('/profile/getProfile/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }

        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });
    describe('/profile/getPeriodInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).get('/profile/getPeriodInfo/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }
        
        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });
    describe('/profile/getGeneralInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).get('/profile/getGeneralInfo/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }

        
        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });
    describe('/profile/editProfile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).put('/profile/editProfile/'+tempUserId+'/fa')
           .send({
                "birthdate": "1377-05-08",
                "cycleLength": 30,
                "periodLength": 8,
                "sleepingHour": 9,
                "pmsLength": 3,
                "height": 155,
                "weight": 75,
                "pregnant": false,
                "pregnancyTry": false,
                "useLock": false,
                "lastPeriodDate": "2020-07=01",
                "bloodType": "A+"
              }
            )
           .set('x-auth-token', tempToken);
        }
        
        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });
    describe('/profile/editPeriodInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).put('/profile/editPeriodInfo/'+tempUserId+'/fa')
           .send({
                "cycleLength": 30,
                "periodLength": 8,
                "pmsLength": 3,
                "pregnant": 0,
                "pregnancyTry": 0,
                "lastPeriodDate": "2020-07-05"
            })
           .set('x-auth-token', tempToken);
        }
        it('should be return 400 if user id invalid', async() => {
            tempToken=token;
            tempUserId=userId+100;
            const result=await exec();    
            expect(result.status).toBe(400);

        });

        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });
    describe('/profile/editGeneralInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).put('/profile/editGeneralInfo/'+tempUserId+'/fa')
           .send({
                "birthdate": "1377-05-08",
                "sleepingHour": 9,
                "height": 155,
                "weight": 75,
                "useLock": 0,
                "bloodType": "A+"
            })
           .set('x-auth-token', tempToken);
        }
        it('should be return 400 if user id invalid', async() => {
            tempToken=token;
            tempUserId=userId+100;
            const result=await exec();    
            expect(result.status).toBe(400);

        });
        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });

    describe('/profile/deleteProfile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).delete('/profile/deleteProfile/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }
        
        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });


});