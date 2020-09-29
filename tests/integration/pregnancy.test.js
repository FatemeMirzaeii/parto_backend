const request = require('supertest');
const {user ,user_profile } = require("../../models");

describe('pregnancy', () => {
    let server;
    let usr;
    let token;
    let userId;
    let uProfile;
    
    beforeAll(async()=>{
        usr =await user.create({name:"zahra", email:"pregnancy_zzdand7755@gmail.com",phone:"09145454211"});
        token =usr.generateAuthToken();
        userId=usr.id;
        uProfile = await user_profile.create({
            birthdate:new Date("1377-05-05"),
            last_period_date:"2020-01-01",
            pregnant:0,
            pregnancy_try: 0
        });
        await uProfile.setUser(usr);
               
    })
    beforeEach(async() => { 
        server=require('../../development');
    })
    afterEach(()=>{
        server.close();
    })
    afterAll(async () => {
        uProfile.destroy();
        usr.destroy();
    });

    describe('/pregnancy/savePregnancyData/{userId}/{lang}',async () => {
        let tempUserId;
        let tempToken;
        let conceptionDate="2020-06-08";
        const exec=()=>{
            return request(server).post('/pregnancy/savePregnancyData/'+tempUserId+'/fa')
            .send({
                "dueDate": "2021-03-05",
                "abortion": 0,
                "conceptionDate": `${conceptionDate}`
              }).set('x-auth-token', tempToken);
         }
        it('400',async () => {
            tempUserId=userId;
            tempToken=token;
            conceptionDate="2022-06-08";
            await user_profile.update({pregnant:1},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(400);
           
        });
        it('404',async () => {
            let newUsr =await user.create({name:"zahra", email:"pregnancy_zzdand7755@gmail.com",phone:"09175454211"});
            tempToken = newUsr.generateAuthToken();
            tempUserId= newUsr.id;
            conceptionDate="2020-06-08";
            let result=await exec(); 
            await newUsr.destroy();
            expect(result.status).toBe(404);
        });
        it('409',async () => {
            tempUserId=userId;
            tempToken=token;
            conceptionDate="2020-06-08";
            await user_profile.update({pregnant:0},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(409);
           
        });
        it('200',async () => {
            tempUserId=userId;
            tempToken=token;
            conceptionDate="2020-06-08";
            await user_profile.update({pregnant:1},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(200);
        });
    });
    
    describe('/pregnancy/setPregnancyEnd/:userId/:dueDate/:lang', async() => {
        let tempUserId;
        let tempToken;
        let dueDate="2021-03-05";
        const exec=()=>{
            return request(server).post('/pregnancy/setPregnancyEnd/'+tempUserId+'/'+dueDate+'/fa')
            .set('x-auth-token', tempToken);
         }
        
        it('404',async () => {
            let newUsr =await user.create({name:"zahra", email:"pregnancy_zzdand7755@gmail.com",phone:"09185454211"});
            tempToken = newUsr.generateAuthToken();
            tempUserId= newUsr.id;
            let result=await exec(); 
            await newUsr.destroy();
            expect(result.status).toBe(404);
        });

        it('409',async () => {
            tempUserId=userId;
            tempToken=token;
            await user_profile.update({pregnant:0},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(409);
        });
        
        it('200',async () => {
            tempUserId=userId;
            tempToken=token;
            await user_profile.update({pregnant:1},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(200);
        });
    });

    describe('/pregnancy/getPregnancyData/:userId/:lang', async() => {
        let tempUserId;
        let tempToken;
        
        const exec=()=>{
            return request(server).get('/pregnancy/getPregnancyData/'+tempUserId+'/fa')
            .set('x-auth-token', tempToken);
         }
        
        it('404',async () => {
            let newUsr =await user.create({name:"zahra", email:"pregnancy_zzdand7755@gmail.com",phone:"09195454211"});
            tempToken =newUsr.generateAuthToken();
            tempUserId=newUsr.id;
            let result=await exec(); 
            await newUsr.destroy();
            expect(result.status).toBe(404);
        });

        it('200',async () => {
            tempUserId=userId;
            tempToken=token;
            await user_profile.update({pregnant:1},{ where: {   user_id: tempUserId } } );
            let result=await exec(); 
            expect(result.status).toBe(200);
        });
    });
    
});
