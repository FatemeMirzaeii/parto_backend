const request = require('supertest');
const {  user ,user_tracking_option} = require("../../models");

describe('health-tracking', () => {
    let server;
    let usr;
    let token;
    let userId;
   
    beforeAll(async()=>{
        usr =await user.create({name:"zahra", email:"health_zzand7755@gmail.com" ,phone:"09102454210", imei:"123456789012345"});
        token = usr.generateAuthToken();  
        userId=usr.id;
        
    })
    beforeEach(async() => { 
        server=require('./../../development');
       
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
      await usr.destroy();
        
    });

    describe('/userInfo/:userId/:date/:lang', () => {
        
        let tempUserId=userId;
        let TempToken=token;
        const exec=()=>{
           return request(server).get('/healthTracking/userInfo/'+tempUserId+'/2020-07-06/fa')
            .set('x-auth-token', TempToken);
        }
        
        it('400',async()=>{
            tempUserId=userId+100;
            TempToken=token;
            const result=await exec();
            expect(result.status).toBe(400);
        })
        
        it('200',async()=>{
            tempUserId=userId;
            TempToken=token;
            let option=await user_tracking_option.create({
                tracking_option_id: 1,
                date:"2020-07-06"
            })
            await option.setUser(usr); 
            const result=await exec();
            await user_tracking_option.destroy({
                where:{
                    user_id:tempUserId,
                    tracking_option_id: 1,
                    date:"2020-07-06"
                }
            })
            expect(result.status).toBe(200);
            
        });
        
    });   
    
    describe('/userInfo/:userId/:lang', () => {
        
        let tempUserId=userId;
        let TempToken=token;
        const exec=()=>{
           return request(server).post('/healthTracking/userInfo/'+tempUserId+'/fa')
           .send({
            "date": "2020-06-06",
            "deleted": [
              {
                "categoryId": 2,
                "trackingOptionId": 5,
                "hasMultipleChoise": 0
              },
              {
                "categoryId": 2,
                "trackingOptionId": 6,
                "hasMultipleChoise": 0
              }
            ],
            "selected": [
              {
                "categoryId": 1,
                "trackingOptionId": 3,
                "hasMultipleChoise": 0
              },
              {
                "categoryId": 3,
                "trackingOptionId": 11,
                "hasMultipleChoise": 1
              }
            ]
          })
            .set('x-auth-token', TempToken);
        }
        
        it('200',async()=>{
          tempUserId=userId;
          TempToken=token;
          const result=await exec();
          await user_tracking_option.destroy({
              where:{
                  date:"2020-06-06"
              }
          })
          expect(result.status).toBe(200);
            
        });
        
    });   

    
});
