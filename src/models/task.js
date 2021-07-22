const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const taskSchema = new mongoose.Schema({
    description:{ 
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

taskSchema.pre('save', async function(next){
    const task = this
    next()
})

const tasks = mongoose.model('tasks', taskSchema) 


module.exports = tasks