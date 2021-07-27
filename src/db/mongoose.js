const mongoose = require('mongoose')

//'mongodb://127.0.0.1:27017/task-manager-api'
mongoose.connect(process.env.dbPath, {
    useNewUrlParser: true,
    useCreateIndex : true, //몽구스가 몽고디비의 데이터의 인덱스에 빠르게 접근할 수 있음
    useFindAndModify : false,
    useUnifiedTopology: true
}) //connect to database

// const User = mongoose.model('User', { //A model allows us to model something in the real world that we want to be able to store in the database. => collection을 자동으로 생성해줌 이름은 모델의 1 param을 소문자화시킨 것 
//     name: {
//         type: String,  //이 말고도 date, objectID, boolean 등이 있음
//         required: true, //필수 입력사항
//         trim: true //이름에 띄어쓰기 지우기
//     }, 
//     email:{
//         type : String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)){  //npm의 validator 라이브러리를 사용한 validation
//                 throw new Error('email is invlalid')
//             } 
//         }
//     },
//     password : {
//         type : String,
//         required : true,
//         trim: true,
//         validate(value)
//         {
//             if(value.length < 6 || value.toLowerCase().includes("password"))  //include는 대소문자를 구분하지 않으므로 value를 일시적으로 소문자로 바꾸어서 해당 문자가 들어있는지 판별
//                 throw new Error('invalid password')           
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value){  //몽구스에서 제공하는 customized validation
//             if(value < 0)  //value가 들어오면 체크함. 안들어오면 체크 안함
//                 throw new Error('age must be a positive number') //에러 메시지를 띄움
//         }
//     }
// }) //1 : 모델의 이름 2: 모델의 필드

// const me = new User({  //모델의 인스턴스 생성
//     name: "lee2",
//     email: 'dldud2@gmail.com',
//     password: "passwor1d"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("error" + error)
// }) //인스턴스를 데이터베이스에 저장

//  const tasks = mongoose.model('tasks', {
//     description:{ 
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new tasks(
//     {
//         description: "  doing the dish  ",
//     }
// )

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })