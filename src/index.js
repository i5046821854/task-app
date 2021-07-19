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

app.get('/users', (req, res)=>{
    User.find({}).then((users)=>{   //모든 케이스를 찾음
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()  //internal server error /DB랑 연결이 안 되어있을 떄
    })
})

app.get('/users/:id', (req,res)=>{  // url에다가 :xx 형식으로 써주면 뒤에 오는 모든 것들을 id라는 변수에 담아서 핸들링하겠다고 하는 것
    //req.params //{id : url에 id자리에 오는 실제 값} 형식으로 반환 
    const _id = req.params.id
    User.findById(_id).then((user)=>{  //mongo DB는 find하면서 하나도 못 찾았을 경우도 fulfilled로 인식하여 200을 띄워줌 / mongoose는 string id를 object id로 자동 변환해줌 
        if(!user)
            return res.status(404).send() //따라서 하나도 못찾은 경우에 대해서 임의로 404 status를 띄워줌
        res.send(user)
    }).catch(()=>{
        res.status(500).send() //얘는 아예 디비랑 연결이 안되어있을 경우이므로 500status를 띄워줌
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

app.get("/tasks", (req, res)=>{
    Task.find().then((tasks)=>{
        res.send(tasks)
    }).catch(()=>{
        res.status(500).send()
    })
})

app.get("/tasks/:id", (req, res) =>{
    const _id = req.params.id   //req.param을 통해 파라미터로 들어온 값을 object 형식으로 반환반음 / 여기서 id값을 추출하기 위해 params.id 형식으로 뽑아냄
    Task.findById(_id).then((task)=>{
        if(!task)
        {
            return res.status(400).send
        }
        res.send(task)
    }).catch(()=>{
        res.status(500).send()
    })

})
app.listen(port, ()=>{
    console.log('server is up on port' + port)
})