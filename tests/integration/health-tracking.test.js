const request = require('supertest');
const { user,health_tracking_category,
    user_tracking_option } = require("../../models");
const { expectCt } = require('helmet');
const { italics } = require('nodeadmin/middleware/secret');

describe('health_tracking',()=>{
    let server;
    let token;
    let TempToken;
    let User;
    let HTC;
   
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"bazzdand7755@gmail.com"});
        token = User.generateAuthToken();
        console.log(token);
        HTC=health_tracking_category.create({title:"category title"});
    });

    beforeEach(()=>{
       server=require('../../app');
      
   })
   afterEach(async()=>{
      await server.close();
   });   

   afterAll(async()=>{
       await User.destroy();
   })

   describe('/getCategories',async()=>{
        const exec=()=>{
            return request(server).get('/healthTracking/getCategories').set('x-auth-token', TempToken);
        }
        it('should be return 401 if authentication get faild',async()=>{
            TempToken="";
            const result=await exec();
            expect(result.status).toBe(401);
                    
        });
        it('return 200 and all categoryis',async()=>{
            TempToken=token;
            const result= await exec();
            expect(result.status).toBe(200);
            console.log('result',result.body);
            //expect(result.body).
        })
   });

   describe('/addCategory/:lang',async()=>{
        let title;
        const exec=()=>{
            return request(server).post('/healthTracking/addCategory/fa')
            .send({"title":`${tile}`})
            .set('x-auth-token', TempToken);
        }
        
        it('return 400 if title be exist ',async()=>{
            TempToken=token;
            title="";
            const result= await exec();
            expect(result.status).toBe(400);
            console.log('result',result.body);
            
        })
        it('return 400 if title be exist ',async()=>{
            TempToken=token;
            title="category title";
            const result= await exec();
            expect(result.status).toBe(400);
        })

        it('return 200 and add new category and send id and title ',async()=>{
            TempToken=token;
            title="new category title";
            const result= await exec();
            expect(result.status).toBe(200);
            console.log('result',result.body);
            //expect(result.body.id).not.toBeNull();
            //expect(result.body.title).tobe("new category title")
            
        })
   })
})