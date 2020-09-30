const request = require('supertest');
const {user , user_profile , pregnancy } = require("../../models");

describe('interview', () => {
    let server;
    let usr;
    let token;
    let userId;

    beforeAll(async()=>{
        usr =await user.create({name:"zahra", email:"interview_zzdand7755@gmail.com",phone:"09135454211"});
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
        await pregnancy.destroy({where:{user_id:userId}});
        await usr.destroy();
    });

    describe('/ordinarUser/:userId/:lang',async () => {
        let tempUserId;
        let avgPeriodLength=7;
        let lastPeriodDate="2020-07-07";
        const exec=()=>{
            return request(server).post('/interview/ordinarUser/'+tempUserId+'/fa')
            .send({
                "birthdate": "1377-05-05",
                "avgCycleLength": 25,
                "avgPeriodLength": `${avgPeriodLength}`,
                "lastPeriodDate": `${lastPeriodDate}`,
                "pregnancyTry": "0"
              }).set('x-auth-token', token);
         }
        it('400',async () => {
            avgPeriodLength=14;
            lastPeriodDate="2030-07-07";
            tempUserId=userId;
            let result=await exec(); 
            expect(result.status).toBe(400);
           
        });
        
        it('409',async () => {
            tempUserId=userId;
            avgPeriodLength=7;
            lastPeriodDate="2020-07-07";
            let uProfile = await user_profile.create({
                birthdate:new Date("1377-05-05"),
                avg_cycle_length:23,
                avg_period_length:7,
                pregnancy_try:false,
                last_period_date:"2020-01-01"
            });
            await uProfile.setUser(usr);
            let result=await exec(); 
            await uProfile.destroy();
            expect(result.status).toBe(409);
           
        });
        it('200',async () => {
            avgPeriodLength=7;
            lastPeriodDate="2020-07-07";
            tempUserId=userId;
            
            let result=await exec(); 
            await user_profile.destroy({where:{ user_id: tempUserId }});
            expect(result.status).toBe(200);
        });
    });
    
    describe('/pregnantUser/:userId/:lang', async() => {
        let tempUserId;
        let lastPeriodDate="2020-07-07";
        const exec=()=>{
            return request(server).post('/interview/pregnantUser/'+tempUserId+'/fa')
            .send({
                "birthdate": "1377-05-05",
                "lastPeriodDate": `${lastPeriodDate}`,
                "conceptionDate": "2020-05-05",
                "dueDate": "2021-05-05"
              }).set('x-auth-token', token);
         }
        it('400',async () => {
            lastPeriodDate="2030-07-07";
            tempUserId=userId;
            let result=await exec(); 
            expect(result.status).toBe(400);
           
        });
        
        it('409',async () => {
            tempUserId=userId;
            let uProfile = await user_profile.create({
                birthdate:new Date("1377-05-05"),
                conceptionDate: "2020-05-05",
                dueDate: "2021-05-05",
                last_period_date:"2020-01-01"
            });
            await uProfile.setUser(usr);
            let result=await exec(); 
            await uProfile.destroy();
            expect(result.status).toBe(409);
           
        });
        it('200',async () => {
            lastPeriodDate="2020-07-07";
            tempUserId=userId;
            let result=await exec(); 
            await user_profile.destroy({where:{ user_id: tempUserId }});
            expect(result.status).toBe(200);
        });
    });
    
});
