const request = require('supertest');
const {  user , user_log ,user_answer_survey} = require("../../models");

describe('survay', () => {
    let server;
    let User;
    let token;
    let UserID;
    let IMEI;

    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"survay_zzand7755@gmail.com" ,phone:"0912545420", imei:"123456789012345"});
        token = User.generateAuthToken();  
        UserID=User.id;
        IMEI=User.imei;     
    })
    beforeEach(async() => { 
        server=require("../../development")
       
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
        await User.destroy();   
    });

    describe('/survey/question/:lang', () => {
        const exec=()=>{
           return request(server).get('/survey/question/fa');
           
        }
       
        it('return 200',async()=>{
            const result=await exec();
            expect(result.status).toBe(200);
        });

    });    

    describe('/survey/answers/:lang', () => {
        let TempToken;
        let userId;
        let IMEi;
        let rate=5;
        const exec=()=>{
           return request(server).put('/survey/answers/fa')
           .send({"userId":`${userId}`,"IMEi":`${IMEi}`,"rate":`${rate}`,"answers":"1,3","description":"test"})
           .set("x-auth-token",TempToken);
        }
        
        it('return 400 if rate=0',async()=>{
            rate=0;
            TempToken=token;
            const result=await exec();
            expect(result.status).toBe(400);
            
        })
        it('return 400 if imei and userId are null',async()=>{
            rate=5;
            userId=0;
            TempToken=token;
            IMEi="";
            const result=await exec();
            expect(result.status).toBe(400);
            
        })
        it('return 401 if token is not exist  ',async()=>{
            IMEi="";
            userId=UserID;
            TempToken="";
            rate=5;
            const result=await exec();
            expect(result.status).toBe(401);
            
        })
        it('return 400 if userId is not exist  ',async()=>{
            IMEi="";
            userId=UserID;
            TempToken="asnkjnlkzmx.ahaskjxilkjcmn.ajilkjnxkjszx.sxnkjmnkm";
            rate=5;
            const result=await exec();
            expect(result.status).toBe(400);
            
        })
        it('return 200 if imei defind and rate defind',async()=>{
            IMEi="agsajhsjknxzklkoz";
            TempToken=token;
            const result=await exec();
            await  user_answer_survey.destroy({where:{IMEI:IMEi}});
            expect(result.status).toBe(200);
        });
        it('return 200 if userId and token defind and rate defind',async()=>{
            IMEi="";
            userId= UserID;
            TempToken = token;
            const result=await exec();
            await  user_answer_survey.destroy({where:{userId:UserID}});
            expect(result.status).toBe(200);
        });
       
                 
    });    

});
