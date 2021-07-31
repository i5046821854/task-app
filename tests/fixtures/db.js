//테스트용 유저를 생성을 위한 함수를 선언

const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const User = require('../../src/models/users')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()  // 현재 타임스탬프를 기준으로 object id 생성

const userOne = {   //테스트용 계정 생성
    _id : userOneId,
    name: "test",
    email: "asdsad@naver.com",
    password: "dsadasdsad123",
    tokens:[{
        token: jwt.sign({_id: userOneId}, process.env.secretKey)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId,
    name: "test2",
    email: "asdsad2@naver.com",
    password: "dsadasdsad123",
    tokens:[{
        token: jwt.sign({_id: userOneId}, process.env.secretKey)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description: "task1",
    completed: false,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description: "task2",
    completed: true,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description: "task3",
    completed: true,
    owner : userTwo._id
}


const setupDatabase = async() => {    //각 테스트가 끝난 뒤에 db를 비워주고 테스트용 계정을 생성
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}