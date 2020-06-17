const error= require('../../../middleware/error');
const { expectCt } = require('helmet');

describe('send or handle internal error',()=>{
    it('should return status 500 that show internal error',()=>{
        // const err={status:500,message:"Internal Server Error"};
        // const getError=error(err,req,res,next);
        // expectCt(getError.status).toBe(err.status);

    });
});