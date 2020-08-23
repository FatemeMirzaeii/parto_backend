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
            zygosis_date:""
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

    describe('/profile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec=()=>{
           return request(server).get('/profile/'+tempUserId+'/fa').set('x-auth-token', tempToken);
        }

        it('should be return 401 if authentication get faild',async()=>{
            tempToken="";
            tempUserId=userId;
            const result=await exec();
            expect(result.status).toBe(401);
                    
        });

        it('should be return 404 if user id is not exist in database', async() => {
            tempToken=token;
            tempUserId=userId+100;
            const result=await exec();    
            expect(result.status).toBe(404);

        });

        it('should be return 200 and article content if article id is exist in database',async () => {
            tempToken=token;
            tempUserId=userId;
            const result=await exec(); 
            expect(result.status).toBe(200);
            
        });
    });

});