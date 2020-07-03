const request = require('supertest');
const { user,health_tracking_category,
    user_tracking_option,health_tracking_option } = require("../../models");

describe('health_tracking',()=>{
    let server;
    let token;
    let TempToken;
    let User;
    let htc;
    let id;
    let hto;
    const date=new Date(2016, 5, 5)
   
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"helth_zzdand7755@gmail.com"});
        token = User.generateAuthToken();
        hto=await health_tracking_option.create({title:"helth tracking option title"});
        htc=await hto.createHealth_tracking_category({title:"category title"});
        id=htc.id;
    });

    beforeEach(()=>{
       server=require('../../app');
      
   })
   afterEach(async()=>{
      await server.close();
   });   

   afterAll(async()=>{
       await User.destroy();
       await hto.destroy();
       await htc.destroy();
   })

   describe('/getCategories',()=>{
        const exec=()=>{
            return request(server).get('/healthTracking/getCategories').set('x-auth-token', TempToken);
        }
        
        it('return 200 and all categoryis',async()=>{
            TempToken=token;
            const result= await exec();
            expect(result.status).toBe(200);
            expect(result.body.data[0].title).toBe('category title');
        });
   });

   describe('/addCategory/:lang',()=>{
        let title;
        const exec=()=>{
            return request(server).post('/healthTracking/addCategory/fa')
            .send({"title":`${title}`})
            .set('x-auth-token', TempToken);
        };
        
        it('return 400 if title be exist ',async()=>{
            TempToken=token;
            title='category title';
            const result= await exec();
            expect(result.status).toBe(400);
        });

        it('return 200 and add new category and send id and title ',async()=>{
            TempToken=token;
            title='new category title';
            const result= await exec();
            expect(result.status).toBe(200);
            expect(result.body.data.title).toBe('new category title');
            await health_tracking_category.destroy({
                where: {
                  id: result.body.data.id
                }
            });
            
        });
   });
   describe('editCategory/:lang/:id',()=>{
        let tempId;
        let title='edit category title';
        TempToken=token;
        const exec=()=>{
            return request(server).put('/healthTracking/editCategory/fa/'+ tempId)
            .send({"title":`${title}`})
            .set('x-auth-token', TempToken);
        };
        it('return 404 if id is not exist ',async()=>{
            tempId=id+5;
            const result=await exec();
            expect(result.status).toBe(404);
        });
        it('return 200 if id was exist and update title succesfuly',async()=>{
            tempId=id;
            const result=await exec();
            expect(result.status).toBe(200);
            
        });
    });

    describe('/deleteCategory/:lang/:id',()=>{
        let tempId;
        let delet_User;
        const TempToken = User.generateAuthToken();
        const exec=()=>{
            return request(server).delete('/healthTracking/deleteCategory/fa/'+ tempId).set('x-auth-token', TempToken);
        };
        beforeAll(async()=>{
            delet_User =await user.create({name:"zahra", email:"helth_delete7755@gmail.com"});
        })
        it('return 404 if id is not exist ',async()=>{
            tempId=delet_User.id+5;
            const result=await exec();
            expect(result.status).toBe(404);
        });
        it('return 200 if id was exist and delte succesfuly',async()=>{
            
            tempId=delet_User.id;
            const result=await exec();
            expect(result.status).toBe(200);
        });

    });

    // describe('/setUserInfo',async()=>{
    //     TempToken=token;
    //     const exec=()=>{
    //         return request(server).post('/healthTracking/setUserInfo')
    //             .send( {"date": date,"user_id":User.id ,"health_tracking_option_id": [hto]})
    //             .set('x-auth-token', TempToken);
    //     };
        
    //     it('return 200 and send option to user',async()=>{
    //         const result=await exec();
    //         console.log("setToken",TempToken);
    //         expect(result.status).toBe(200);
    //         expect(result.body.data).not.toBeNull();
    //     });

    // });
    describe('/getUserInfo/:userId/:date',()=>{
        let tempId;
        TempToken=token;
        const exec=()=>{
            return request(server).get('/healthTracking/getUserInfo/'+User.id+'/'+date)
                .set('x-auth-token', TempToken);
        };
        
        it('return 200 and send option to user',async()=>{
            const result=await exec();
            expect(result.status).toBe(200);
            expect(result.body.data).not.toBeNull();
        });

    });

})