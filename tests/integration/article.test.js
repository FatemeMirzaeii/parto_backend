const request = require('supertest');
const { article, user ,category} = require("../../models");

describe('article', () => {
    let server;
    let lang='fa';
    let articleId;
    let newArticle;
    let token;
    let User;
    let newCat;
    let categoryId
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"zakizkand7755@gmail.com"});
        token = User.generateAuthToken();
        nawCat=await category.create({title:"categoryTitle"});
        let art={title:"titleTest",content:"contentTest"};
        newArticle= await article.create(art);
        let cat=await category.findAll({where: { id: 1 } });
        let setCat=await newArticle.addcategory(newCat);
       // newArticle= await article.create(art);
        articleId=newArticle.id;
    })
    beforeEach(async() => { 
        server=require('../../app');
       
    })
    afterAll(async () => {
        //await server.close();
        await newArticle.destroy();
        await User.destroy();
        await newCat.destroy();
       
    });

    describe('/article/getArticleContent/:lang/:articleId', () => {
        const exec=()=>{
           return request(server).get('/article/getArticleContent/'+lang+'/'+tempArticleId).set('x-auth-token', TempToken);
        }

        it('should be return 401 if authentication get faild',async()=>{
            TempToken="";
            tempArticleId=articleId;
            const result=await exec();
            expect(result.status).toBe(401);
                    
        });

        it('should be return 404 if article id is not exist in database', async() => {
            TempToken=token;
            tempArticleId=1;
            const result=await exec();    
            expect(result.status).toBe(404);

        });

        it('should be return 200 and article content if article id is exist in database',async () => {
            TempToken=token;
            tempArticleId=articleId;
            const result=await exec();  
            expect(result.status).toBe(200);
            expect(JSON.stringify(result.body)).toBe('{"data":{"content":"contentTest"}}');
        });
    });

    describe('/article/getArticleTitle/:lang/:articleId', () => {
        const exec=()=>{
           return request(server).get('/article/getArticleTitle/'+lang+'/'+tempArticleId).set('x-auth-token', TempToken);
        }

        it('should be return 401 if authentication get faild',async()=>{
            TempToken="";
            tempArticleId=articleId;
            const result=await exec();
            expect(result.status).toBe(401);
                    
        });
        it('should be return 404 if article id is not exist in database', async() => {
            TempToken=token;
            tempArticleId=1;
            const result=await exec();    
            expect(result.status).toBe(404);

        });

        it('should be return 200 and article title if article id is exist in database',async () => {
            TempToken=token;
            tempArticleId=articleId;
            const result=await exec();  
            expect(result.status).toBe(200);
            expect(JSON.stringify(result.body)).toBe('{"data":{"title":"titleTest"}}');
        });
    });

    describe('/article/getArticlesList/:categoryId', () => {
        
        const exec=()=>{
           const req=request(server).get('/article/getArticlesList/'+categoryId);
           console.log(req.header);
           console.log(req.url);  
           return req;
        }


        it('should be return 200 and article that have same category id in database',async () => {
            const result=await exec();  
            console.log(result.status+" "+result.body+"   "+result);  
            expect(result.status).toBe(200);
            console.log(result.body);
            expect(JSON.stringify(result.body)).toBe('{"data":{"articles":"contentTest"}}');
        });
    });


});