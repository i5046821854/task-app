const request = require('supertest') //실제로 호스팅하지 않고도 http 요청을 전송, 수신 받을 수 있음
const app = require('../src/app')
const User = require('../src/models/users')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const userOneId = new mongoose.Types.ObjectId()  // 현재 타임스탬프를 기준으로 object id 생성
const userOne = {   //테스트용 계정 생성
    _id : userOneId,
    name: "test",
    email: "asdsad@naver.com",
    password: "dsadasdsad123",
    tokens:[{
        token: jwt.sign({_id: userOneId}, process.env.secretKey)
    }]
}

beforeEach(async()=>{  //각 테스트를 시행하기 전 모든 데이터 베이스를 지우고 테스트 계정으로 접속하기 위한 메소드   / beforeAll : 모든 테스트를 끝내고 시행할 것
    await User.deleteMany()
    await new User(userOne).save()
})  


test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({       //sned에 들어가는 내용을 body로 해서  /users에 post방법으로 http request를 전송. / 하지만 한번 send한 유저는 다음번 테스트 시 사용 못함 (같은 이메일을 가진 사용자로 해석되므로)
        name: 'Andrew',    //http request
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201) //얘의 리턴값을 http response임

    //데이터베이스에 잘 입력 되었는지
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()  //not : 뒤에 올것에 대한 부정

    //리스폰스에 관한 체크
    expect(response.body).toMatchObject({   //리스폰스 받은 것이 test유저와 같은가
        user:{
            name: "Andrew",
            email: 'andrew@example.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!')  //패스워드가 해쉬 되어있는지 판별
})

test('should log in with proper Account', async()=>{   //로그인 체크 (정상)
    const response = await request(app).post('/users/login').send({
        name: userOne.name,
        email: userOne.email,
        password: userOne.password
    }).expect(200)  

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: "test",
            email: "asdsad@naver.com",
        },
        token : user.tokens[1].token   //로그인하면서 토큰 하나 더 생기니까 [1]로 접근
    })

})

test('should log in with improper account', async()=>{  //로그인 체크 (비정상)
    await request(app).post('/users/login').send({
        name: "asasas",
        email: "asdasd@email.com",
        password: "password"
    }).expect(400)
})

test('read my profile', async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)   //authorization을 위해 http 리퀘스트에 authorization param을 넣어주는 모습
        .send()
        .expect(200)
})

test('not authorized to read', async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('delete my profile', async()=>{
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    //다 잘 지워졌는지
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('not authorizaed to delete', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})