const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({  //middleware의 함수들을 사용할 수 있도록 모델을 schema에 넣어줌
name: {
    type: String,  //이 말고도 date, objectID, boolean 등이 있음
    required: true, //필수 입력사항
    trim: true //이름에 띄어쓰기 지우기
}, 
email:{
    type : String,
    unique: true, //중복 비허용
    required: true,
    trim: true,
    lowercase: true,
    validate(value){
        if(!validator.isEmail(value)){  //npm의 validator 라이브러리를 사용한 validation
            throw new Error('email is invlalid')
        } 
    }
},
password : {
    type : String,
    required : true,
    trim: true,
    validate(value)
    {
        if(value.length < 6 || value.toLowerCase().includes("password"))  //include는 대소문자를 구분하지 않으므로 value를 일시적으로 소문자로 바꾸어서 해당 문자가 들어있는지 판별
            throw new Error('invalid password')           
    }
},
age: {
    type: Number,
    default: 0,
    validate(value){  //몽구스에서 제공하는 customized validation
        if(value < 0)  //value가 들어오면 체크함. 안들어오면 체크 안함
            throw new Error('age must be a positive number') //에러 메시지를 띄움
    }
 },
tokens: [
    {
        token: {
            type: String,
            required: true
        }
    }
]  //유저가 발생시킨 토큰 (오브젝트들의 배열로 구성)
})

userSchema.virtual('Tasks', {  //실제 db에는 포함되지 않지만 특정한 처리를 하기 위해 가상으로 만들어지는 필드
    ref: 'tasks',  //어떤 모델이랑 연결할 것인가
    localField: "_id", //유저에서 어떤 필드와
    foreignField: "owner" //task에서 어떤 필드를 연결할 것인가  >> 이러면 localfield의 값을 foreignfield에서 찾음
})

userSchema.methods.toJSON = function (){   //router/user.js 에서 res.send()에 오브젝트를 넣을 경우, 자동적으로 이를 JSON으로 변환해서 전송되는데, 이때 자동적으로 toJSON메소드가 호출됨 
    const user = this
    const userRAW = user.toObject() //몽구스가 제공하는 여러 함수 (save ... )들을 제외한 raw object만 가져옴
    
    delete userRAW.password //객체의 속성을 제거하는 delete연산자
    delete userRAW.tokens

    return userRAW  //결국 res에 담겨지는 객체는 기존 user의 정보에서 password와 token의 정보가 숨겨지고 나머지만 전송됨
}


userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'thisismynewcourse')  //1st param: 토큰에 담을 데이터 / 2nd param 토큰의 식별자
    user.tokens = user.tokens.concat({token}) //기존 배열에 새 배열 아이템 추가하기
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) =>{  //스키마에다 커스텀 메소드를 만드는 방법 : schema.statics.methodName >> 이렇게 되면 model에서 사용할 수 있음
    const user = await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)  //해쉬된 패스워드와 plain text 패스워드의 비교
    if(!isMatch){
        throw new Error('unable to login in')
    }
    return user
}

//hash the password
userSchema.pre('save', async function(next){  //.pre : 1st param(target event)이 실행되기 전 / .post : 1st param이 실행된 이후  => 모든 save 메소드 실행 전에 이 로직이 실행됨
    const user = this  //this는 저장될 유저 객체
    if(user.isModified('password')){  //password가 수정되었을 떄만 실행
        user.password = await bcrypt.hash(user.password, 8)  //패스워드를 해쉬해서 저장
    }

    next() //함수의 끝을 알리기 위한 next 함수 (없으면 더 이상 진행 안됨)
})

userSchema.pre('remove', async function(next){   //유저를 지울 때 그 실행 이전에 실행될 미들웨어에서 유저가 생성한 task를 지우는 과정
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema) //1 : 모델의 이름 2: 모델의 스키마

module.exports = User