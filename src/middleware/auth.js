const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async(req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')  //value에 삽입된 'bearer'를 삭제 
        const decoded = jwt.verify(token, 'thisismynewcourse') //토큰을 객체형으로 변환
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) //토큰이 delete되지 않고 남아있는지 확인하기 위해서 'tokens.token' : token 을 써줘서 어레이에 포함되어있는지 확인 (따옴표 이유는 속성의 이름이 특별하기 떄문 ) //변환된 토큰의 id와 일치하는 유저를 찾아냄
        if(!user)
            throw new Error()
        req.token = token  
        req.user = user //리퀘스트에 속성을 하나 추가해주고 해당 속성값에 찾은 유저를 넣어줌으로써 라우터에서 쉽게 접근할 수 있도록  
        next() 
    }catch(e){  //authentication에 실패할 경우  
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth