const express=  require('express')
require('./db/mongoose')  //여기  require에서는 변수나 함수를 가져오는 것이 아니라 database와 연결하기 위함임 MongoClient.connect 문장

const User = require('./models/users')
const Task = require('./models/task')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())  //이렇게 선언하면 서버로 들어오는 모든 json을 object로 파싱해줌 

app.post("/users", (req, res)=>{  //클라이언트가 post방식으로 서버에 요청할 떄 (클라이언트는 json형식으로 body에 데이터를 실어서 보냄)
    const user = new User(req.body) //user모델에 새로운 인스턴스를 추가해주되 그 인스턴스의 생성자에다가 req.body를 넣어줌
    user.save().then(()=>{   //데이터베이스에 저장됨
        res.status(201).send(user) //status가 201이면 create이므로 더 정확함
    }).catch((error)=>{   
        //res.send(error)  //이렇게 되면 브라우저에는 200의 http status가 뜸 (올바른 요청), 이를 4xx, 5xx로 바꿔주어서 에러임을 알려주어야함
        res.status(400)
        res.send(error)  
        //res.status(400).send(error) 의 형식으로도 써도 됨
        
        
    })
})

app.post("/tasks", (req, res) => {
    const task = new Task(req.body)
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})
app.listen(port, ()=>{
    console.log('server is up on port' + port)
})