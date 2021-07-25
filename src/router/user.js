//user에 관련한 처리를 담당할 라우터

const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router() //create a router
const multer = require('multer')
const { request } = require('express')

router.post("/users", async (req, res)=>{  //클라이언트가 post방식으로 서버에 요청할 떄 (클라이언트는 json형식으로 body에 데이터를 실어서 보냄)  / express는 async를 써도 리턴할 필요 없음
    const user = new User(req.body) //user모델에 새로운 인스턴스를 추가해주되 그 인스턴스의 생성자에다가 req.body를 넣어줌
    
    try{   //async로 선언된 콜백 함수를 핸들링하기 위한 await
        await user.save()
        const token = await user.generateAuthToken()  //회원가입 후 authentication token을 부여함
        res.status(201).send({user, token})
    }catch(e) {
        res.status(400).send(e)
    }

    // user.save().then(()=>{   //데이터베이스에 저장됨
    //     res.status(201).send(user) //status가 201이면 create이므로 더 정확함
    // }).catch((error)=>{   
    //     //res.send(error)  //이렇게 되면 브라우저에는 200의 http status가 뜸 (올바른 요청), 이를 4xx, 5xx로 바꿔주어서 에러임을 알려주어야함
    //     res.status(400)
    //     res.send(error)  
    //     //res.status(400).send(error) 의 형식으로도 써도 됨 
    // })
})

router.get('/users', auth, async (req, res)=>{  //2nd param에 미들웨어가 들어간다면 콜백 전에 미들웨어 함수가 실행됨
    
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }

    // User.find({}).then((users)=>{   //모든 케이스를 찾음
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()  //internal server error /DB랑 연결이 안 되어있을 떄
    // })
})

router.get('/users/me', auth, async (req, res)=>{  //자신의 정보만 보여주기    
    try{
        res.send(req.user)  //auth.js에서 새로 저장한 
    }catch(e){
        res.status(500).send()
    }

})

 
router.get('/users/:id', async(req,res)=>{  // url에다가 :xx 형식으로 써주면 뒤에 오는 모든 것들을 id라는 변수에 담아서 핸들링하겠다고 하는 것
    //req.params //{id : url에 id자리에 오는 실제 값} 형식으로 반환 
   
    const _id = req.params.id
   
    try{
        const user = await User.findById(_id)
        if(!user)
            return res.status(404).send() //따라서 하나도 못찾은 경우에 대해서 임의로 404 status를 띄워줌
        res.send(user)    
    }catch(e){
        res.status(500).send()
    }
   
    // User.findById(_id).then((user)=>{  //mongo DB는 find하면서 하나도 못 찾았을 경우도 fulfilled로 인식하여 200을 띄워줌 / mongoose는 string id를 object id로 자동 변환해줌 
    //     if(!user)
    //         return res.status(404).send() //따라서 하나도 못찾은 경우에 대해서 임의로 404 status를 띄워줌
    //     res.send(user)
    // }).catch(()=>{
    //     res.status(500).send() //얘는 아예 디비랑 연결이 안되어있을 경우이므로 500status를 띄워줌
    // })
})


router.patch('/users/me',auth, async(req,res)=>{  //authenticated된 자신의 인스턴스 정보만 수정

    console.log('hello')
    const updates = Object.keys(req.body) //객체의 key들을 열거할 수 있는 배열로 반환합니다.
    const allowedUpdated = ["name", 'email', 'password', 'age'] //바꿀수 있는 프로퍼티
    const isValid = updates.every((update)=>{ // every() 메서드는 배열 안의 모든 요소가 주어진 판별 함수를 통과하는지 테스트합니다. Boolean 값을 반환합니다
        return allowedUpdated.includes(update)
        //어레이의 모든 엘리먼트를 대상으로 실행되는 콜백, 하나라도 false나오면 전체가false
    })

    if(!isValid){
        return res.status(400).send("error: invalid update")
    }
    try{
        const user = req.user
        updates.forEach((update)=>{
            user[update] = req.body[update]   //user.update라고 쓸 수 없음. update 값은 동적으로 변하는 값이니까
        })
        await user.save()
        res.send(user)
    }catch(e){
        res.status(405).send(e)  //올바른 정보를 입력하지 않았을 떄
    }
    
})


router.patch('/users/:id',async(req,res)=>{  //patch : update / 이전처럼 update함수에 {}로 고칠 값을 주는 것이 아니라, http body에 고칠 것을 받고 이를 여기서 받아서 처리하는 형식으로

    const updates = Object.keys(req.body) //객체의 key들을 열거할 수 있는 배열로 반환합니다.
    const allowedUpdated = ["name", 'email', 'password', 'age'] //바꿀수 있는 프로퍼티
    const isValid = updates.every((update)=>{ // every() 메서드는 배열 안의 모든 요소가 주어진 판별 함수를 통과하는지 테스트합니다. Boolean 값을 반환합니다
        return allowedUpdated.includes(update)
        //어레이의 모든 엘리먼트를 대상으로 실행되는 콜백, 하나라도 false나오면 전체가false
    })

    if(!isValid){
        return res.status(400).send("error: invalid update")
    }
    try{
        //미들웨어를 사용하기 위해 mongoose를 우회하지 않는 findById사용
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update] = req.body[update]   //user.update라고 쓸 수 없음. update 값은 동적으로 변하는 값이니까
        })
        await user.save()
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(405).send(e)  //올바른 정보를 입력하지 않았을 떄
    }
})

const avatar = multer({   //multer로 http req에서 파일을 추출하여 특정 공간에 저장할 미들웨어 생성
    //dest: 'avatar',  ///파일들이 업로드되는 공간  / 여기서 dest를 선언하면 뒤에 router에서 avatar에 접근할 수 없으므로 유저 모델과 연결하기 힘들어짐 그래서 이 줄을 주석처리하면 avatar 폴더에 저장되지 않고 그대로 request.file에 실려 가게됨 
    limits:{   //옵션 설정
        fileSize: 1000000  //최대 파일 사이즈 (1mb)
    },
    fileFilter(req, file, callback){  //파일에 들어갈 여러 필터링을 위한 함수 1nd param: 리퀘스트, 2nd param : 파일, 3rd param: multer에게 필터링 작업이 끝났음을 알려주는 메소드 (next와 비슷)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ //확장자가 doc나 docx가 아닐 경우 (정규표현식으로 나타낸 것, endswith('doc')로 나타내도됨)
            return callback(new Error('file must be a jpg'))
        }
        callback(undefined, true) //no error and accept the file
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req,res)=>{   //프로필 사진 추가를 위한 endponit, 2nd param은 미들웨어로서 http req에서 'avatar'라는 키값을 가진 파일을 dest에 저장
    req.user.avatar = req.file.buffer // req.file is an object which contains all of those properties we explored before about the file and we're going to be using one called Buffer. Buffer contains a buffer of all of the binary data for that file and this is exactly what we want access to.  //얘는 multer에서 dest로 지정하지 않았을 경우에만 사용할 수 있음
    await req.user.save()
    res.send("OK")
},(error, req, res, next)=>{  //에러 핸들링을 위한 콜백 (이 네가지 를 넣어줘야지 express에서 error handler로서 인식함)
    res.status(404).send({error:error.message})
})

router.delete('/users/me/avatar', auth, async(req,res)=>{   //유저의 아바타 지우기
    req.user.avatar = undefined
    await req.user.save()
    res.send("OK")
})

router.post('/users/login', async(req,res)=>{ //이메일과 패스워드를 검사하면서 로그인
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() //하나의 인스턴스(유저)에 대한 토큰 생성이니까 User가 아니고 user의 메소드
        res.send({user, token})
    }catch (e){
        res.status(400).send(e)
    }

})

router.post('/users/logout', auth, async(req,res)=>{  //현재 사용중인 토큰에 대한 로그아웃
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{   //한 유저가 가지고 있는 모든 토큰 중 현재의 토큰만 삭제해서 다시 저장
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }

})

router.post('/users/logoutAll', auth, async(req,res)=>{  //한 계정으로 접근 중인 모든 세션에 대한 토큰 해제 (로그아웃)

    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/users/me',auth, async (req,res)=>{  //자신의 계정을 지우기
    try{
        // const user = await User.findByIdAndDelete(req.user._id) 
        // return res.send(user)
        await req.user.remove()  //위에와 동일한 역할을 함. 한 인스턴스를 지움
        return res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
}) 

router.delete('/users/:id',auth, async (req,res)=>{  //아이디를 하나 지정해서 지우기
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user)
            return res.status(404).send() 
        return res.send(user)
    }catch(e){
        res.status(500).send()
    }
}) 

module.exports = router