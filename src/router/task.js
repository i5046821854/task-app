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

router.get("/tasks", auth, async(req, res)=>{
    try{
        //const tasks = await Task.find({owner : req.user._id}) // 얘는 task에서 owner 프로퍼티를 사용
        await req.user.populate('Tasks').execPopulate()  //위에 거랑 같은 결과 , 얘는 유저를 기준으로 task를 추출
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