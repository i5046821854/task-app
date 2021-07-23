const express=  require('express')
require('./db/mongoose')  //여기  require에서는 변수나 함수를 가져오는 것이 아니라 database와 연결하기 위함임 MongoClient.connect 문장

const app = express()


// app.use((req, res, next)=>{   //app.use()를 이용한 express middleware function

//     if(req.method === 'GET'){
//         res.send('GET request is disable')  //get 이면 라우트 핸들러 실행 하지 않음
//     }else{
//         next()   //get이 아니면 라우트 핸들러 ㄱㄱ
//     }
    
// })

app.use(express.json())  //이렇게 선언하면 서버로 들어오는 모든 json을 object로 파싱해줌 

const userRouter = require('./router/user')
const taskRouter = require('./router/task')
app.use(userRouter) //connect the router with app, 외부에서 정의한 app.get을 여기에서 사용하겠다
app.use(taskRouter)

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log('server is up on port' + port)
})

const jwt = require('jsonwebtoken')

const User = require('./models/users')
const Task = require('./models/task')

const main = async()=>{
    const user = await User.findById()
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()
/*const myFunction = async()=>{
   const token = jwt.sign({_id: 'adsa123'},"thisismycourse", {expiresIn: '7 days'})
   jwt.verify(token, "thisismycourse")   //맞다면 객체형식으로 토큰의 데이터 (sing 메소드으 1st param) 반환, 아니라면 에러)
}

myFunction()*/