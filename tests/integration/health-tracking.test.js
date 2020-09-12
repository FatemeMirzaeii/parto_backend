const request = require('supertest');
const { user,health_tracking_category,
    user_tracking_option,health_tracking_option } = require("../../models");

describe('health_tracking',()=>{
    let server;
    let token;
    let User;
    let htc;
    let id;
    let userId;
    let hto;
    let delet_cat_id;
    const date=new Date(2016, 5, 5)
   
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"helth_zzdand7755@gmail.com"});
        token = User.generateAuthToken();
        userId= User.dataValues.id;
        //const delet_category =await health_tracking_category.create({title:"delet health tracking option title"});
        //delet_cat_id=delet_category.id;
        //hto=await health_tracking_option.create({title:"haelth tracking option title"});
        //htc=await hto.createHealth_tracking_category({title:"category title"});
        //id=htc.id;
    });

    beforeEach(()=>{
       server=require('../../app');
      
   })
   afterEach(async()=>{
        server.close();
   });   

   afterAll(async()=>{
       await User.destroy();
       //await hto.destroy();
       //await htc.destroy();
       
   })

//    describe('/getCategories',()=>{
//         const exec=()=>{
//             return request(server).get('/healthTracking/getCategories').set('x-auth-token', TempToken);
//         }
        
//         it('return 200 and all categoryis',async()=>{
//             TempToken=token;
//             const result= await exec();
//             expect(result.status).toBe(200);
//             expect(result.body.data[0].title).not.toBeNull();
//         });
//    });

//    describe('/addCategory/:lang',()=>{
//         let title;
//         const exec=()=>{
//             return request(server).post('/healthTracking/addCategory/fa')
//             .send({"title":`${title}`})
//             .set('x-auth-token', TempToken);
//         };
        
//         it('return 400 if title be exist ',async()=>{
//             TempToken=token;
//             title='category title';
//             const result= await exec();
//             expect(result.status).toBe(400);
//         });

//         // it('return 200 and add new category and send id and title ',async()=>{
//         //     TempToken=token;
//         //     title='new category title';
//         //     const result= await exec();
//         //     expect(result.status).toBe(200);
//         //     expect(result.body.data.title).toBe('new category title');
//         //     await health_tracking_category.destroy({
//         //         where: {
//         //           id: result.body.data.id
//         //         }
//         //     });
            
//         // });
//    });
//    describe('editCategory/:lang/:id',()=>{
//         let tempId;
//         let title='edit category title';
//         TempToken=token;
//         const exec=()=>{
//             return request(server).put('/healthTracking/editCategory/fa/'+ tempId)
//             .send({"title":`${title}`})
//             .set('x-auth-token', TempToken);
//         };
//         it('return 404 if id is not exist ',async()=>{
//             tempId=id+5;
//             const result=await exec();
//             expect(result.status).toBe(404);
//         });
//         it('return 200 if id was exist and update title succesfuly',async()=>{
//             tempId=id;
//             const result=await exec();
//             expect(result.status).toBe(200);
            
//         });
//     });
//     describe('/deleteCategory/:lang/:id',()=>{
        
//         const exec=()=>{
//             return request(server).delete('/healthTracking/deleteCategory/fa/'+ tempId).set('x-auth-token', token);
//         };
        
//         it('return 404 if id is not exist ',async()=>{
//             tempId=5+delet_cat_id;
//             const result=await exec();
//             expect(result.status).toBe(404);
//         });
//         it('return 200 if id was exist and delte succesfuly',async()=>{
//             tempId=delet_cat_id;
//             console.log("delet_User_id"+tempId);
//             const result=await exec();
//             expect(result.status).toBe(200);
//         });

//     });

    describe('/healthTracking/userInfo/{lang}',()=>{
        let tempUserId=userId;
        const exec=()=>{
            return request(server).post('/healthTracking/userInfo/'+tempUserId+'/fa')
                .send({"date":"2020-05-05",
                    "selected":[
                        {   "categoryId": 1,
                            "trackingOptionId": 1,
                            "hasMultipleChoise": 0
                        }],
                    "deleted": [
                            {   "categoryId": 1,
                                "trackingOptionId": 1,
                                "hasMultipleChoise": 0
                            }]
                        })
                .set('x-auth-token', token);
        };
        
        it('return 200 and send option to user',async()=>{
            tempUserId=userId;
            let result=await exec();
            expect(result.status).toBe(200);
        });
        it('return 400 where user id is not exist',async()=>{
            tempUserId=userId+100;
            const result=await exec();
            expect(result.status).toBe(400);
        });

    });

    describe('/userInfo/:userId/:date/:lang',async()=>{
        console.log("token",token)
        let tempUserId=userId;
        const exec=()=>{
            return request(server).get('/healthTracking/userInfo/'+tempUserId+'/2020-07-05/fa')
            .set('x-auth-token', token);
        };
        
        it('return 200 and send option to user',async()=>{
            tempUserId=userId;
            let result=await exec();
            expect(result.status).toBe(200);
        });
        it('return 400 where user id is not exist',async()=>{
            tempUserId=userId+100;
            let result=await exec();
            expect(result.status).toBe(400);
        });

    });

    
})