const request = require('supertest');
const { user } = require("../../models");

describe('cycle',()=>{

    let server;
    let User;
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"zzdand7755@gmail.com"});
        
    })

    beforeEach(()=>{
        server=require('../../app');
       
    })
    afterEach(async()=>{
       await server.close();
       
        
    })

    describe("/cycle/deleteCycle/:cycleId",()=>{

    })
    describe("/cycle/getCyclePeriodDays/:cycleId",()=>{

    })
    describe("/cycle/getCycleFertilityDays/:cycleId",()=>{

    })
    describe("/cycle/addPeriodDay",()=>{

    })
    describe("/cycle/deletePeriodDay/:cycleId/:date",()=>{

    })
    describe("/cycle/getCyclesHistory/:userId",()=>{

    })
    describe("/cycle/getCycleAnalysis/:userId",()=>{

    })
    describe("/cycle/getCycleForecast/:userId",()=>{

    })
    describe("/cycle/getCycleIdFromDate/:userId/:date",()=>{

    })

})