const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./users')
const taskSchema = new mongoose.Schema({
    description:{ 
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{   //task를 하나 추가할 떄 추가한 유저의 id를 집어넣어야함
        type: mongoose.Schema.Types.ObjectId,   //objectid 타입을 표현하는 방법
        required: true,
        ref: 'User', //reference to other models , 태스크와 이를 작성한 유저 간에 연관성을 맺어줌
    }
})

taskSchema.pre('save', async function(next){
    const task = this
    next()
})

const tasks = mongoose.model('tasks', taskSchema) 


module.exports = tasks