//task에 관련한 처리를 담당할 라우터 (리소스마다 route를 나눠서 한 파일에 처리)


const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post("/tasks", auth,  async(req, res) => {
    //const task = new Task(req.body)
    console.log(req.user._id)
    const task = new Task({
        ...req.body,   //...연산자를 쓰면서 req.body에 있는 모든 프로퍼티를 task에 옮겨줌
        owner: req.user._id   //task를 만든 사용자의 id를 넣어줌
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((error)=>{
    //     res.status(400).send(e)
    // })
})

// router.get("/tasks", auth, async(req, res)=>{
//     try{
//         //const tasks = await Task.find({owner : req.user._id}) // 얘는 task에서 owner 프로퍼티를 사용
//         await req.user.populate('Tasks').execPopulate()  //위에 거랑 같은 결과 , 얘는 유저를 기준으로 task를 추출
//         res.send(req.user.Tasks) 
//     }catch(e){res.status(500).send()}
    
    
//     // Task.find().then((tasks)=>{
//     //     res.send(tasks)
//     // }).catch(()=>{
//     //     res.status(500).send()
//     // })
// })

//GET /tasks?completed=false 형식으로 쿼리스트링이 주어질 때
//페이지네이션은 라우터에 옵션을 부여하는 형식으로 (url : GET /tasks?limit=2&skip=2)
//sorting은 /tasks?sortBy=createdAt_desc or /tasks?sortBy=createdAt:desc 의 형식으로 필드에 대해 오름차순 / 내림차순 표현
router.get("/tasks", auth, async(req, res)=>{
    const match = {}   //match를 위한 객체 선언
    const sort = {} //sort를 위한 객체 선언

    if(req.query.completed)   //match를 하기 위해 url에 completed의 조건을 적어주었을 때
    {
        match.completed = (req.query.completed === 'true')  //쿼리 스트링에 적혀있는 true는 불리언이 아니라 스트링임. 그래서 문자열 비교 형식을 통해 match의 completed 프로퍼티에 넣어줌
    }

    if(req.query.sortBy)
    {
        const part = req.query.sortBy.split(':')
        sort[part[0]] = (part[1] === 'asc'? 1 : -1)   //sort의 속성 값이 1일 경우 asc(오름차순), -1일 경우 desc(내림차순)임
    }

    try{
        await req.user.populate({
            path: 'Tasks',   //프로퍼티의 이름
            match,   //표출할 속성값의 조건 (여기서는 match: match인데 shortcut형식으로 쓴것임)
            options:{
                limit: parseInt(req.query.limit),   //limit: 한 페이지에 표출할 레코드 수  / 쿼리 스트링은 스트링 형식이므로 이를 정수형으로 바꾸기 위해 parseInt()
                skip: parseInt(req.query.skip),  //몇번째 레코드부터 보여줄 건지
                sort //sort:sort이지만 shortcut으로 줄인 것임
            } 
        }).execPopulate()  //위에 거랑 같은 결과 , 얘는 유저를 기준으로 task를 추출
        res.send(req.user.Tasks) 
    }catch(e){res.status(500).send()}
    
    
    // Task.find().then((tasks)=>{
    //     res.send(tasks)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
})

router.get("/tasks/:id", auth, async(req, res) =>{
    const _id = req.params.id   //req.param을 통해 파라미터로 들어온 값을 object 형식으로 반환반음 / 여기서 id값을 추출하기 위해 params.id 형식으로 뽑아냄
    try{
        //const task = await Task.findById(_id)
        
        const task = await Task.findOne({_id, owner: req.user._id}) //auth된 사용자의 task만 읽기

        if(!task)
            return res.status(404).send()
        return res.send(task)
    }catch(e){
        res.status(500).send()
    }
    
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
router.patch('/tasks/:id', auth,  async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValid)
    {
        return res.status(400).send("error: invalid update")
    }
    try
    {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        // new : true,
        // runValidators: true,
        // })
        
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id}) //auth된 사용자의 task만 업데이트하기
        if(!task)
        {
            return res.status(400).send("no task for the id")
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
            task.save()
        })

        return res.send(task)
    }catch(e){
        return res.status(500).send("error: invalid")
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    try{
       // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})   //auth된 사용자의 task만 지우기
        if(!task)
            return res.status(404).send()
        return res.send(task)
    }catch(e)
    {
        res.status(500).send()
    }
    
})

module.exports = router