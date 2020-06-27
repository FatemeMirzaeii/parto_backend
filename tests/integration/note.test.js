const request = require('supertest');
const { note, user } = require("../../models");

describe('note',()=>{
    let server;
    let token;
    let User;
    let UserId;
    let date;
    let Note;

    beforeAll(async()=>{
        Note = await note.create({title:"note title",content:"note content",note_date: new Date(2018, 4, 15)});
        User =await Note.createUser({name:"zahra", email:"note_zzdand7755@gmail.com"});
        token = User.generateAuthToken();
        //console.log('note_token',token);
        UserId= User.dataValues.id;
        date=Note.note_date;
    });

    beforeEach(()=>{
       server=require('../../app');
      
   })
   afterEach(async()=>{
      await server.close();
   });   

   afterAll(async()=>{
       await Note.destroy();
       await User.destroy();
   })

   describe('/:lang/:userId/:date',()=>{

    const exec=()=>{
        const res= request(server).get('/note/fa/'+UserId+"/"+date).set('x-auth-token', token);;
        return res;
   }
    it('return 400 if data is not correct or is not exist',async()=>{
        date="2020-01-01";
        const result=await exec();
        expect(result.status).toBe(404);
    })
    it('return 400 if user id is not correct or is not exist',async()=>{
        UserId=1;
        const result=await exec();
        expect(result.status).toBe(404);
    })
    it('return 400 if user id and date are not correct or are not exist',async()=>{
        UserId=1;
        date="2020-01-01";
        const result=await exec();
        expect(result.status).toBe(404);
    })
    it('return 200 if user id and date are exist and send content to user',async()=>{
        UserId= User.dataValues.id;
        date=Note.note_date;
        const result=await exec();
        expect(result.status).toBe(200);
        expect(result.body.data).not.toBeNull();
        
    })

   })
})