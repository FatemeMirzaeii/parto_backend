const error= require('../../../middleware/error');
const { expectCt } = require('helmet');

describe('send or handle internal error',()=>{
    it('should return status 500 that show internal error',()=>{
        let res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        const next=jest.fn();
        const req= {body:jest.fn()};
        const err={status:500,message:"Internal Server Error"};
        error(err,req,res,next);
        expect(req.status).toBe(err.status);

    });
});