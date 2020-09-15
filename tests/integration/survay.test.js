const request = require('supertest');
const {  user , user_log ,user_answer_survey} = require("../../models");

describe('survay', () => {
    let server;
    let User;
    let token;
    let UserID;
    let IMEI;

    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"survay_zzand7755@gmail.com" ,phone:"", imei:"123456789012345"});
        token = User.generateAuthToken();  
        UserID=User.id;
        IMEI=User.imei;     
    })
    beforeEach(async() => { 
        server=require('./../development');
       
    })
    afterEach(()=>{
         server.close();
    })
    afterAll(async () => {
        let User_log=await user_log.findOne({where: {user_id:UserID}});
        let userAnswerSurvey= await user_answer_survey.findOne({where:{userId:UserID}})
        await userAnswerSurvey.destroy();
        await User_log.destroy(); 
        await User.destroy();   
    });

    describe('/survay/surveyQuestion/:lang', () => {
        let TempToken=token;
        let userId=UserID;
        let IMEi="123456789012345";
        const execWithUserId=()=>{
           return request(server).post('/survay/surveyQuestion/fa')
           .send({"userId":`${userId}`})
           .set('x-auth-token', TempToken);
        }
        const execWidutUserId=()=>{
            return request(server).post('/survay/surveyQuestion/fa')
            .send({"IMEi":`${IMEi}`});
         }
        it('return 400 if token is not valid ',async()=>{
            TempToken="eaashasdwj.ajhyuishjkdhsjo.swihwuischsjk.dowdsjmcoiwck";
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
        let IMEi="123456789012345";
        let rate=5;
        const execWithUserId=()=>{
           return request(server).put('/survay/userSurveyAnswer/fa')
           .send({"userId":`${userId}`,"rate":`${rate}`,"answers":"1,3","description":"test"})
           .set('x-auth-token', TempToken);
        }
        const execWidutUserId=()=>{
            return request(server).post('/survay/surveyQuestion/fa')
            .send({"IMEi":`${IMEi}`,"rate":`${rate}`,"answers":"1,3","description":"test"});
           
         }
        it('return 400 if token is not valid ',async()=>{
            TempToken="eaashasdwj.ajhyuishjkdhsjo.swihwuischsjk.dowdsjmcoiwck";
            const result=await execWithUserId();
            expect(result.status).toBe(400);
            
        })
        it('return 401 if token is not exist  ',async()=>{
            TempToken='';
            const result=await execWithUserId();
            expect(result.status).toBe(401);
            
        })
        it('return 400 if userId is not exist  ',async()=>{
            TempToken=token;
            userId=UserID+10;
            const result=await execWithUserId();
            expect(result.status).toBe(400);
            
        })
    
        it('return 200 if send survay question and information to user UserId',async()=>{
            TempToken=token;
            userId=UserID;
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
            
        });
             
    });    

});
