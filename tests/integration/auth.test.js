const request = require('supertest');
const { user ,user_log} = require("../../models");
const bcrypt = require("bcrypt");
let server;

describe('auth',()=>{

    let User;
    let email="mzzand7755@gmail.com";
    let password="11111111";
    let User_log;
    
    beforeAll(async()=>{
        const hash = await bcrypt.hash(password, 10);
        await user.create({
          name: "zahra",
          email: email,
          password: hash
        });
        User= await user.findOne({ where: {email: email} });
        
    });
    beforeEach(async()=>{
        server= require('../../app');
    })
    afterEach(async()=>{
        await server.close();
    })
    afterAll(async()=>{
        await User_log.destroy();
        await User.destroy();
    })
    
    describe("/signIn/:lang",()=>{
        
        const exec=()=>{
           const res= request(server).post('/auth/signIn/fa')
            .send({"name":"zahra","email":`${email}`,"password":`${password}`});
            return res;
        }

        it('return 400 if email is not exist or invalid',async()=>{
            email='bbzand@gmail.com';
            const result=await exec();
            expect(result.status).toBe(400);
                    
        });

        it('return 400 if password is not correct',async()=>{
            password='zzbb111';
            const result=await exec();
            expect(result.status).toBe(400);

        });
        it('return 200 if every thing be ok and send token and id for user',async()=>{
            email='mzzand7755@gmail.com';
            password='11111111';
            const result=await exec();
            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(User.id);
            User_log=await user_log.findOne({where: {user_id:User.id}});
        })

    })
    describe("/forgotPassword",()=>{

    })
    describe("/changePassword",()=>{

    })
    describe("/sendVerificationCode",()=>{

    })
    

})