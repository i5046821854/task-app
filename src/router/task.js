//task에 관련한 처리를 담당할 라우터 (리소스마다 route를 나눠서 한 파일에 처리)


const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post("/tasks", async(req, res) => {
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(error)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.get("/tasks", async(req, res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks) 
    }catch(e){res.status(500).send()}
    
    
    // Task.find().then((tasks)=>{
    //     res.send(tasks)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
})

router.get("/tasks/:id", async(req, res) =>{
    const _id = req.params.id   //req.param을 통해 파라미터로 들어온 값을 object 형식으로 반환반음 / 여기서 id값을 추출하기 위해 params.id 형식으로 뽑아냄
    try{
        const task = await Task.findById(_id)
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
router.patch('/tasks/:id', async(req,res)=>{
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
        
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        if(!task)
        {
            return res.status(400).send("no task for the id")
        }
        return res.send(task)
    }catch(e){
        return res.status(500).send("error: invalid")
    }
})

router.delete('/tasks/:id', async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task)
            return res.status(404).send()
        return res.send(user)
    }catch(e)
    {
        res.status(500).send()
    }
    
})

module.exports = router