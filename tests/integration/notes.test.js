
const request = require('supertest');
const { user, note, user_log } = require("../../models");

describe('note', () => {
    let usr;
    let server;
    let token;
    let userId;
    let uNote;
    let noteId;
    beforeAll(async () => {
        usr = await user.create({ email: "note@gmail.com", phone: "09185454211" });
        token = usr.generateAuthToken();
        userId = usr.id;
        uNote = await note.create({
            title: "title",
            content: "content",
            note_date: "2020-01-01"
        });
        await uNote.setUser(usr);
        noteId = uNote.id;
    })
    beforeEach(async () => {
        server = require('../../development');
    })
    afterEach(() => {
        server.close();
    })
    afterAll(async () => {
        await uNote.destroy();
        // let userLog=await user_log.findOne({where: {user_id:userId}});
        // await userLog.destroy();
        await usr.destroy();
    });

    describe('GET-/note/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        const exec = () => {
            return request(server).get('/notes/' + tempUserId + '/fa')
                .set('x-auth-token', tempToken);
        }

        it('return 200 if every things be ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 404 if information not found', async () => {
            let newUser = await user.create({ name: "zahra", email: "tempNOte@gmail.com", phone: "09165454210" });
            tempToken = await newUser.generateAuthToken();
            tempUserId = await newUser.id;
            const result = await exec();
            await newUser.destroy();
            expect(result.status).toBe(404);

        });
        it('return 400 if user not exist', async () => {
            tempToken = token;
            tempUserId = userId + 3;
            const result = await exec();
            expect(result.status).toBe(400);

        });
    });

    describe('GET-/note/:userId/:noteId/:lang', () => {
        let tempToken;
        let tempUserId;
        let tempNoteId;
        const exec = () => {
            return request(server).get('/notes/' + tempUserId + '/' + tempNoteId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 400 if resive inavalid intery', async () => {
            tempToken = token;
            tempUserId = userId + 100;
            tempNoteId = noteId;
            const result = await exec();
            expect(result.status).toBe(400);
        });
        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId;
            const result = await exec();
            expect(result.status).toBe(200);
        });
        it('return 404 no note ', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId + 100;
            const result = await exec();
            expect(result.status).toBe(404);
        });
    });

    describe('PUT-/note/:userId/:noteId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        let tempNoteId = noteId;
        let tempTitle = "title";
        let tempContent = "content";
        let date = "2021-01-01";
        const exec = () => {
            return request(server).put('/notes/' + tempUserId + '/' + tempNoteId + '/fa')
                .send({ "title": tempTitle, "content": tempContent, "noteDate": date })
                .set('x-auth-token', tempToken);
        }

        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId;
            let result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 404 if  note information not found', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId + 3;
            let result = await exec();
            expect(result.status).toBe(404);
        });
        it('return 400 if date is null', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId;
            date = null;
            const result = await exec();
            expect(result.status).toBe(400);
        });
        it('return 400 if content and title are null', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId;
            tempTitle = null;
            tempContent = null;
            date = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(400);
        });
        it('return 400 if user not exist', async () => {
            tempToken = token;
            tempUserId = userId + 3;
            tempNoteId = noteId;
            tempTitle = "title";
            tempContent = "content";
            date = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(400);

        });
    });

    describe('POST-/note/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        let tempTitle = "title";
        let tempContent = "content";
        let date = "2021-01-01";
        const exec = () => {
            return request(server).post('/notes/' + tempUserId + '/fa')
                .send({ "title": tempTitle, "content": tempContent, "noteDate": date })
                .set('x-auth-token', tempToken);
        }

        it('return 400 if date is null', async () => {
            tempToken = token;
            tempUserId = userId;
            date = null;
            const result = await exec();
            expect(result.status).toBe(400);

        });
        it('return 400 if content and title are null', async () => {
            tempToken = token;
            tempUserId = userId;
            tempTitle = null;
            tempContent = null;
            date = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(400);

        });
        it('return 400 if user not exist', async () => {
            tempToken = token;
            tempUserId = userId + 3;
            tempTitle = "title";
            tempContent = "content";
            date = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(400);

        });
        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            tempTitle = "title";
            tempContent = "content";
            date = "2021-01-01";
            const result = await exec();
            note.destroy({ where: { id: result.body.data.noteId } });
            expect(result.status).toBe(200);
            expect(result.body.data).not.toBeNull();
        });
    });

    describe('POST-/note/syncNote/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        
        const exec = () => {
            return request(server).post('/notes/syncNote/' + tempUserId + '/fa')
                .send({
                    "data": [
                        {
                            "state": 1,
                            "title": "req.body.title1",
                            "content": "req.body.content2",
                            "noteDate": "2020-03-09"
                        },
                        {
                            "state": 2,
                            "title": "titleupdated",
                            "content": "req.body.content",
                            "noteDate": "2020-03-09",
                            "id": 7
                        },
                        {
                            "state": 3,
                            "title": "req.body.title1",
                            "content": "req.body.content2",
                            "noteDate": "2020-03-09"
                        }

                    ]
                })
                .set('x-auth-token', tempToken);
        }

        it('return 400 if date is null', async () => {
            tempToken = token;
            tempUserId = userId+10;
            const result = await exec();
            expect(result.status).toBe(400);

        });

        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            console.log("res11",result.body.data);
            //note.destroy({ where: { id: result.body.data.noteId } });
            expect(result.status).toBe(200);
            expect(result.body.data).not.toBeNull();
        });
    });

    describe('GET-/note/syncNote/:userId/:syncTime/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        let tempSyncTime= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
        const exec = () => {
            return request(server).get('/notes/syncNote/' + tempUserId +'/'+tempSyncTime+ '/fa')
                .set('x-auth-token', tempToken);
        }

        it('return 200 if every things be ok and suncTime is not null', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);
        });
        it('return 200 if every things be ok is null', async () => {
            tempToken = token;
            tempUserId = userId;
            tempSyncTime="null";
            const result = await exec();
            expect(result.status).toBe(200);
        });
        
        it('return 400 if user not exist', async () => {
            tempToken = token;
            tempUserId = userId + 3;
            const result = await exec();
            expect(result.status).toBe(400);

        });
    });

    describe('DELETE-/note/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;

        const exec = () => {
            return request(server).delete('/notes/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 400 if date is null', async () => {
            tempToken = token;
            tempUserId = userId + 3;
            const result = await exec();
            expect(result.status).toBe(400);

        });
        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);
        });
    });
    describe('DELETE-/note/:userId/:noteId/:lang', async () => {
        let tempToken = token;
        let tempUserId = userId;
        let tempNote = await note.create({
            title: "title",
            content: "content",
            note_date: "2020-01-01"
        });
        await tempNote.setUser(usr);
        let tempNoteId = uNote.id;

        const exec = () => {
            return request(server).delete('/notes/' + tempUserId + '/' + tempNoteId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 400 if date is null', async () => {

            tempToken = token;
            tempUserId = userId + 10;
            tempNoteId = noteId;
            const result = await exec();
            expect(result.status).toBe(400);

        });
        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            tempNoteId = noteId;
            const result = await exec();
            expect(result.status).toBe(200);
        });
    });

});