require('../src/db/mongoose')
const { countDocuments } = require('../src/models/task')
const task = require('../src/models/task')

const deleteTaskandCount = async (id)=>{
    await task.findByIdAndDelete(id)
    const count = await task.countDocuments({completed : false})
    return count
}

deleteTaskandCount('60f658861a7def6f40e3414b').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})

// task.findByIdAndDelete('60f58d33bd31e96fa01d97a8').then(()=>{
//     return task.countDocuments({completed: false})    
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })