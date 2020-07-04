const error= require('../../../middleware/error');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('send or handle internal error',()=>{
    it('should return status 500 that show internal error',async()=>{
        let res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        const next=jest.fn();
        const req= {body:jest.fn()};
        const err={status:500,message:"Internal Server Error"};
        await error(err,req,res,next);
        expect(req.status).toBe(err.status);

    });
});