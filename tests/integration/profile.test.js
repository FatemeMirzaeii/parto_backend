const request = require('supertest');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { user_profile, user } = require("../../models");

describe('profile', () => {
    let server;
    let userId;
    let token;
    let uProfile;
    beforeAll(async () => {
        newUser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454211" });
        token = newUser.generateAuthToken();
        userId = newUser.id;
        uProfile = await user_profile.create({
            birthdate: new Date("1377-05-05"),
            avg_cycle_length: 23,
            avg_period_length: 7,
            avg_sleeping_hour: 8,
            pms_length: 3,
            height: 158,
            weight: 58,
            pregnant: false,
            pregnancy_try: false,
            locked: false,
            last_period_date: "1300-01-01",
            ovulation_prediction: false,
            period_prediction: false,
            red_days: false
        });
        await uProfile.setUser(newUser);
    })
    beforeEach(async () => {
        server = require('../../development');

    })
    afterEach(() => {
        server.close();
    })
    afterAll(async () => {
        await uProfile.destroy();
        await newUser.destroy();

    });

    describe('/profile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('/profile/periodInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/periodInfo/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('/profile/generalInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/generalInfo/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }


        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('/profile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).put('/profile/' + tempUserId + '/fa')
                .send({
                    "birthdate": "1377-05-08",
                    "cycleLength": 30,
                    "periodLength": 8,
                    "sleepingHour": 9,
                    "pmsLength": 3,
                    "height": 155,
                    "weight": 75,
                    "pregnant": false,
                    "pregnancyTry": false,
                    "isLock": false,
                    "lastPeriodDate": "2020-07=01",
                    "bloodType": "A+",
                    "ovulationPred": 0,
                    "periodPred": 0,
                    "redDays": 0
                }
                )
                .set('x-auth-token', tempToken);
        }

        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('/profile/periodInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).put('/profile/periodInfo/' + tempUserId + '/fa')
                .send({
                    "cycleLength": 30,
                    "periodLength": 8,
                    "pmsLength": 3,
                    "pregnant": 0,
                    "pregnancyTry": 0,
                    "lastPeriodDate": "2020-07-05",
                    "ovulationPred": 0,
                    "periodPred": 0,
                    "redDays": 0
                })
                .set('x-auth-token', tempToken);
        }
        // it('should be return 404 if user id invalid', async() => {
        //     tempToken=token;
        //     tempUserId=userId+100;
        //     const result=await exec();    
        //     expect(result.status).toBe(404);

        // });

        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('/profile/generalInfo/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).put('/profile/generalInfo/' + tempUserId + '/fa')
                .send({
                    "birthdate": "1377-05-08",
                    "sleepingHour": 9,
                    "height": 155,
                    "weight": 75,
                    "isLock": 0,
                    "bloodType": "A+"
                })
                .set('x-auth-token', tempToken);
        }
        // it('should be return 400 if user id invalid', async() => {
        //     tempToken=token;
        //     tempUserId=userId+100;
        //     const result=await exec();    
        //     expect(result.status).toBe(400);

        // });
        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });
    describe('get/profile/pregnancyMode/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/pregnancyMode/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
        it('return 404', async () => {
            let tempuser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454217" });
            tempToken = tempuser.generateAuthToken();
            tempUserId = tempuser.id;
            const result = await exec();
            expect(result.status).toBe(404);
            await tempuser.destroy();
        });
    });

    describe('get/profile/userStatus/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/userStatus/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
        it('return 404', async () => {
            let tempuser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454217" });
            tempToken = tempuser.generateAuthToken();
            tempUserId = tempuser.id;
            const result = await exec();
            expect(result.status).toBe(404);
            await tempuser.destroy();
        });
    });

    describe('put/profile/userStatus/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        let pregnant;
        const exec = () => {
            return request(server).put('/profile/userStatus/' + tempUserId + '/fa')
                .send({ "pregnant": `${pregnant}`, "pregnancyTry": 0 })
                .set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            pregnant = 1;
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 400 - user information is null', async () => {
            tempToken = token;
            tempUserId = userId;
            pregnant = 2;
            const result = await exec();
            expect(result.status).toBe(400);
        });
    });

    describe('get/profile/lockStatus/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).get('/profile/lockStatus/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
        it('return 404', async () => {
            let tempuser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454217" });
            tempToken = tempuser.generateAuthToken();
            tempUserId = tempuser.id;
            const result = await exec();
            expect(result.status).toBe(404);
            await tempuser.destroy();
        });

    });

    describe('put/profile/lockStatus/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        let isLock;
        const exec = () => {
            return request(server).put('/profile/lockStatus/' + tempUserId + '/fa')
                .send({ "isLock": `${isLock}` })
                .set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            isLock = 1;
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 400 - user information is null', async () => {
            let tempuser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454219" });
            tempToken = tempuser.generateAuthToken();
            tempUserId = tempuser.id;
            isLock = 1;
            const result = await exec();
            expect(result.status).toBe(400);
            await tempuser.destroy();
        });

        it('return 400 - user information is null', async () => {
            tempToken = token;
            tempUserId = userId;
            isLock = 2;
            const result = await exec();
            expect(result.status).toBe(400);
        });
    });

    describe('post/profile/lastSyncTime/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        let lastSyncTime;
        const exec = () => {
            return request(server).post('/profile/lastSyncTime/' + tempUserId + '/fa')
                .send({ "lastSyncTime": `${lastSyncTime}` })
                .set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            lastSyncTime = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 400 -lastSyncTime is null;', async () => {
            tempToken = token;
            tempUserId = userId;
            lastSyncTime = "";
            const result = await exec();
            expect(result.status).toBe(400);
        });
    });

    describe('post/profile/sync/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const execWithData = () => {
            return request(server).post('/profile/sync/' + tempUserId + '/fa')
                .send({
                    "data": [
                        {
                            birthdate: "1377-05-05",
                            avg_cycle_length: 23,
                            avg_period_length: 7,
                            avg_sleeping_hour: 8,
                            pms_length: 3,
                            height: 158,
                            weight: 58,
                            pregnant: false,
                            user_id: `${tempUserId}`,
                            pregnancy_try: false,
                            locked: false,
                            last_period_date: "1300-01-01",
                            ovulation_prediction: false,
                            period_prediction: false,
                            red_days: false
                        }
                    ]
                })
                .set('x-auth-token', tempToken);
        }
        const execWithoutData = () => {
            return request(server).post('/profile/sync/' + tempUserId + '/fa')
                .send({ "data": [] })
                .set('x-auth-token', tempToken);
        }

        it('return 200 ', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await execWithData();
            expect(result.status).toBe(200);
        });

        it('return 404 - user not exist', async () => {
            let tempuser = await user.create({ name: "zahra", email: "profile_zzdand7755@gmail.com", phone: "09125454218" });
            tempToken = tempuser.generateAuthToken();
            tempUserId = tempuser.id;
            await tempuser.destroy();
            const result = await execWithoutData()
            expect(result.status).toBe(404);
        });

        it('return 200 -data is null', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await execWithoutData();
            expect(result.status).toBe(200);
        });
    });

    describe('get/profile/sync/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        let syncTime;
        const exec = () => {
            return request(server).get('/profile/sync/' + tempUserId + '/' + syncTime + '/fa').set('x-auth-token', tempToken);
        }
        it('return 200 - with syncTime', async () => {
            tempToken = token;
            tempUserId = userId;
            syncTime = "2021-01-01";
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 200 - syncTime is null', async () => {
            tempToken = token;
            tempUserId = userId;
            syncTime = null;
            const result = await exec();
            console.log ("rrrrrr",result);
            expect(result.status).toBe(200);
        });

    });

    describe('/profile/:userId/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).delete('/profile/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('should be return 200 and article content if article id is exist in database', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);

        });
    });



});