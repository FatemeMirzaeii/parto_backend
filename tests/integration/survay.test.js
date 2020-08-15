const request = require('supertest');
const {  user , survey_answer , user_answer_survey } = require("../../models");

describe('survay', () => {
    let server;
    let User;
    let token;
    let UserID;
    let IMEI;

    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"survay_zzand7755@gmail.com" , imei:"12345678900000"});
        token = User.generateAuthToken();  
        UserID=User.id;
        IMEI=User.imei;     
    })
    beforeEach(async() => { 
        server=require('../../app');
       
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
       await User.destroy();   
    });

    describe('/survay/surveyQuestion/:lang', () => {
        let TempToken=token;
        let userId=UserID;
        let IMEi=IMEI;
        const execWithUserId=()=>{
           return request(server).post('/survay/surveyQuestion/fa')
           .send({"userId":`${userId}`,"IMEi":`${IMEi}`})
           .set('x-auth-token', TempToken);
        }
        const execWidutUserId=()=>{
            return request(server).post('/survay/surveyQuestion/fa')
            .send({"IMEi":`${IMEi}`});
         }
        it('return 400 if token is not valid ',async()=>{
            TempToken=token+"ea";
            console.log(TempToken);
            let result=await execWithUserId();
            expect(result.status).toBe(400);
            
        })
        it('return 401 if token is not exist  ',async()=>{
            TempToken='';
            let result=await execWithUserId();
            expect(result.status).toBe(401);
            
        })
    
        it('return 200 if send survay question and information to user UserId',async()=>{
            TempToken=token;
            const result=await execWithUserId();
            expect(result.status).toBe(200);
        });
        it('return 200 if send survay question and information to user with IMEI',async()=>{
            const result=await execWidutUserId();
            expect(result.status).toBe(200);
        });

        it('return 400 if imei is null',async()=>{
            IMEi='';
            const result=await execWidutUserId();
            expect(result.status).toBe(400);
        });
    });    

    describe('/survay/userSurveyAnswer/:lang', () => {
        let TempToken=token;
        let userId=UserID;
        let IMEi=IMEI;
        let rate=5;
        const execWithUserId=()=>{
           return request(server).put('/survay/userSurveyAnswer/fa')
           .send({"userId":`${userId}`,"IMEi":`${IMEi}`,"rate":`${rate}`,"answers":"1,3","description":"test"})
           .set('x-auth-token', TempToken);
        }
        const execWidutUserId=()=>{
            return request(server).post('/survay/surveyQuestion/fa')
            .send({"IMEi":`${IMEi}`,"rate":`${rate}`,"answers":"1,3","description":"test"});
           
         }
        it('return 400 if token is not valid ',async()=>{
            TempToken=token+'ea';
            const result=await execWithUserId();
            expect(result.status).toBe(400);
            
        })
        it('return 401 if token is not exist  ',async()=>{
            TempToken='';
            const result=await execWithUserId();
            expect(result.status).toBe(401);
            
        })
    
        it('return 200 if send survay question and information to user UserId',async()=>{
            TempToken=token;
            const result=await execWithUserId();
            expect(result.status).toBe(200);
        });
        it('return 200 if send survay question and information to user with IMEI',async()=>{
            const result=await execWidutUserId();
            expect(result.status).toBe(200);
        });

        it('return 400 if imei is null',async()=>{
            IMEi='';
            let result=await execWidutUserId();
            expect(result.status).toBe(400);
            TempToken=token;
            result=await execWithUserId();
            expect(result.status).toBe(400);
        });
        it('return 400 if imei is null',async()=>{
            IMEi=IMEi;
            rate='';
            let result=await execWidutUserId();
            expect(result.status).toBe(400);
            TempToken=token;
            result=await execWithUserId();
            expect(result.status).toBe(400);
            
        });
        it('return 400 if user id invalid',async()=>{
            IMEi=IMEi;
            rate=5;
            TempToken=token;
            userId=UserID+100;
            const result=await execWithUserId();
            expect(result.status).toBe(400);
        });
    });    

});