const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { note, user } = require("../../models");

describe('note',()=>{
    let server;
    let token;
    let User;
    let UserId;
    let Ndate;
    let Note;

    beforeAll(async()=>{
        Note = await note.create({title:"note title",content:"note content",note_date: new Date(2018, 4, 15)});
        User =await Note.createUser({name:"zahra", email:"note_zzdand7755@gmail.com"});
        token = User.generateAuthToken();
        //console.log('note_token',token);
        UserId= User.dataValues.id;
        Ndate=Note.note_date;
    });

    beforeEach(()=>{
       server=require('./../development');
      
   })
   afterEach(async()=>{
        server.close();
   });   

   afterAll(async()=>{
       await Note.destroy();
       await User.destroy();
       
   })

   describe('/:lang/:userId/:date',()=>{
        let tempUserId=UserId;
        let date=Ndate;
        const exec=()=>{
            const res= request(server).get('/note/fa/'+tempUserId+"/"+date).set('x-auth-token', token);
            return res;
        }
        it('return 404 if date is not correct or is not exist',async()=>{
            tempUserId=UserId;
            date="2020-01-01";
            const result=await exec();
            expect(result.status).toBe(404);
        })
        it('return 400 if user id is not correct or is not exist',async()=>{
            tempUserId=1;
            date=Ndate;
            const result=await exec();
            expect(result.status).toBe(400);
        })
        it('return 400 if user id and date are not correct or are not exist',async()=>{
            tempUserId=1;
            date=Ndate;
            date="2020-01-01";
            const result=await exec();
            expect(result.status).toBe(400);
        })
        it('return 200 if user id and date are exist and send content to user',async()=>{
            tempUserId= UserId;
            date=Ndate;
            const result=await exec();
            expect(result.status).toBe(200);
            expect(result.body.data).not.toBeNull();
            
        })

   })
})