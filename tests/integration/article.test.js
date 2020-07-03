const request = require('supertest');
const { article, user } = require("../../models");

describe('article', () => {
    let server;
    let lang='fa';
    let articleId;
    let newArticle;
    let token;
    let User;
    let newCat;
    let categoryId=2;
    beforeAll(async()=>{
        User =await user.create({name:"zahra", email:"art_zzdand7755@gmail.com"});
        token = User.generateAuthToken();
        let art={title:"titleTest",content:"contentTest"};
        newArticle= await article.create(art);
        newCat=await newArticle.createCategory({id: 2,title:"categoryTitle"});
        articleId=newArticle.id;
       
    })
    beforeEach(async() => { 
        server=require('../../app');
       
    })
    afterEach(async()=>{
        server.close();
    })
    afterAll(async () => {
        await newArticle.destroy();
        await newCat.destroy();
        await User.destroy();
        server.destroy();
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
            //update article and put category id in it
           const req=request(server).get('/article/getArticlesList/'+categoryId);
           return req;
        }


        it('should be return 200 and article that have same category id in database',async () => {
            const result=await exec();  
            expect(result.status).toBe(200);
            expect(result.body.data.articles[0].content).toBe("contentTest");
        });
    });


});