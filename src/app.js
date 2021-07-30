//supertest를 실행하기 위해서는 express가 선언돼되, app.listen 전에 수행이 되어야함. 따라서 app.js에서
//따로 express를 선언하는 구문을 실행하고 이를 index.js와 test.js에서 이를 사용하도록

const express=  require('express')
require('./db/mongoose')  //여기  require에서는 변수나 함수를 가져오는 것이 아니라 database와 연결하기 위함임 MongoClient.connect 문장

const app = express()


app.use(express.json())  //이렇게 선언하면 서버로 들어오는 모든 json을 object로 파싱해줌 

const userRouter = require('./router/user')
const taskRouter = require('./router/task')
app.use(userRouter) //connect the router with app, 외부에서 정의한 app.get을 여기에서 사용하겠다
app.use(taskRouter)


module.exports = app