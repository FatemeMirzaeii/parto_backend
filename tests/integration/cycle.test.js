
const request = require('supertest');
const { user, user_profile, user_tracking_option } = require("../../models");

describe('cycle', () => {
    let usr;
    let server;
    let token;
    let userId;
    let uProfile;
    beforeAll(async () => {
        usr = await user.create({ name: "zahra", email: "cycle_zzdand7755@gmail.com", phone: "09125454211" });
        token = usr.generateAuthToken();
        userId = usr.id;
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
            last_period_date: "2020-01-01"
        });
        await uProfile.setUser(usr);
    })
    beforeEach(async () => {
        server = require('../../development');
    })
    afterEach(() => {
        server.close();
    })
    afterAll(async () => {
        await user_tracking_option.destroy({
            where: {
                user_id: userId
            }
        })
        await uProfile.destroy();
        let userLog = await user_log.findOne({ where: { user_id: userId } });
        await userLog.destroy();
        await usr.destroy();
    });

    describe('/lastPeriodDate/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;
        const exec = () => {
            return request(server).get('/cycle/lastPeriodDate/' + tempUserId + '/fa')
                .set('x-auth-token', tempToken);
        }

        it('return 200 if every things be ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);
        });

        it('return 404 if information not found', async () => {
            let newUser = await user.create({ name: "zahra", email: "newcycle_zzdand7755@gmail.com", phone: "09125454210" });
            tempToken = await newUser.generateAuthToken();
            tempUserId = await newUser.id;
            const result = await exec();
            await newUser.destroy();
            expect(result.status).toBe(404);

        });
    });

    describe('/lastPeriodDate/:userId/:lastPeriodDate/:lang', () => {
        let tempToken;
        let tempUserId;
        const exec = () => {
            return request(server).put('/cycle/lastPeriodDate/' + tempUserId + '/2020-02-02/fa').set('x-auth-token', tempToken);
        }

        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const result = await exec();
            expect(result.status).toBe(200);
        });
    });

    describe('/bleedingDays/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;

        const exec = () => {
            return request(server).put('/cycle/bleedingDays/' + tempUserId + '/fa')
                .send({ "deleteDate": [], "addDate": ["2022-08-10", "2020-08-10"] })
                .set('x-auth-token', tempToken);
        }

        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            //console.log("us",tempUserId);
            const result = await exec();
            expect(result.status).toBe(200);
        });
    });

    describe('/periodDays/:userId/:lang', () => {
        let tempToken = token;
        let tempUserId = userId;

        const exec = () => {
            return request(server).get('/cycle/periodDays/' + tempUserId + '/fa').set('x-auth-token', tempToken);
        }

        it('return 200 if every things ok', async () => {
            tempToken = token;
            tempUserId = userId;
            const addOption = await user_tracking_option.create({ date: "2020-01-01", tracking_option_id: 2 });
            await addOption.setUser(usr);
            let result = await exec();
            expect(result.status).toBe(200);
        });
    });


});