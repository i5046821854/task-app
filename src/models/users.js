const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', { //A model allows us to model something in the real world that we want to be able to store in the database. => collection을 자동으로 생성해줌 이름은 모델의 1 param을 소문자화시킨 것 
    name: {
        type: String,  //이 말고도 date, objectID, boolean 등이 있음
        required: true, //필수 입력사항
        trim: true //이름에 띄어쓰기 지우기
    }, 
    email:{
        type : String,
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
    }
}) //1 : 모델의 이름 2: 모델의 필드

module.exports = User