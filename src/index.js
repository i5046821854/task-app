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
    console.log('server is up on port' , port , process.env.dbPath)
})

const jwt = require('jsonwebtoken')

const User = require('./models/users')
const Task = require('./models/task')

/*const main = async()=>{
    const task1 = await Task.findById("60fc24d9f0813042e4b39de6")
    await task1.populate('owner').execPopulate() //owner 프로퍼티를 ref(user)에 있는 모델로 치환해서 출력
    //console.log(task1)
    const user = await User.findById("60fc24c7f0813042e4b39dda")
    await user.populate('Tasks').execPopulate()  //Tasks 프로퍼티를 ref(task)에 있는 모델로 치환해서 출력
    //console.log(user.Tasks)

}
main()

const myFunction = async()=>{
   const token = jwt.sign({_id: 'adsa123'},"thisismycourse", {expiresIn: '7 days'})
   jwt.verify(token, "thisismycourse")   //맞다면 객체형식으로 토큰의 데이터 (sing 메소드으 1st param) 반환, 아니라면 에러)
}

myFunction()*/

const multer = require('multer')
const upload = multer({
    dest: 'images',  ///파일들이 업로드되는 공간  
    limits:{   //옵션 설정
        fileSize: 100000  //최대 파일 사이즈 (1mb)
    },
    fileFilter(req,file, callback){  //파일에 들어갈 여러 필터링을 위한 함수 1nd param: 리퀘스트, 2nd param : 파일, 3rd param: multer에게 필터링 작업이 끝났음을 알려주는 메소드 (next와 비슷)
        console.log(file.originalname)
        if(!file.originalname.match(/\.(doc|docx)$/)){ //확장자가 doc나 docx가 아닐 경우 (정규표현식으로 나타낸 것, endswith('doc')로 나타내도됨)
            return callback(new Error('file must be a PDF'))
        }
        callback(undefined, true) //no error and accept the file
    }
})
app.post('/upload', upload.single('upload'), (req,res)=>{   //endpoint for file upload   /2nd param: 미들웨어, multer가 http request에 있는 파일 중  key값이 파라미터와 같은 파일을 찾아냄 >> 그러고 파일을 dest에 들어있는 곳에 저장함 
    res.send("완료")
}, (error, req, res, next)=>{  //에러 핸들링을 위한 콜백 (이 네가지 를 넣어줘야지 express에서 error handler로서 인식함)
    res.status(400).send(
        {error: error.message}
    )
})