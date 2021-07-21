const express=  require('express')
require('./db/mongoose')  //여기  require에서는 변수나 함수를 가져오는 것이 아니라 database와 연결하기 위함임 MongoClient.connect 문장

const app = express()

app.use(express.json())  //이렇게 선언하면 서버로 들어오는 모든 json을 object로 파싱해줌 

const userRouter = require('./router/user')
const taskRouter = require('./router/task')
app.use(userRouter) //connect the router with app, 외부에서 정의한 app.get을 여기에서 사용하겠다
app.use(taskRouter)

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log('server is up on port' + port)
})