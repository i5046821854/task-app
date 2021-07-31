const request = require('supertest')
const Task = require('../src/models/task')
const {userOneId, userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase} = require('./fixtures/db')
const app = require('../src/app')

beforeEach(setupDatabase)  //db.js에 있는 함수를 사용하여 유연하게 beforeEach를 구성 (위에 거랑 동일한 역할)

test('should create task for user', async()=>{   //task 만들기
   const response = await request(app)
   .post('/tasks')
   .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
   .send({
       description : "hello"
   })
   .expect(201)

   const task = await Task.findById(response.body._id)
   expect(task).not.toBeNull()
   expect(task.completed).toEqual(false)
})

test('작성자가 쓴 글 확인', async()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toBe(2)   //글이 두개가 맞는지
})

test("작성자 아니면 task 못 지움", async()=>{
    const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)  //파라미터 전달
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()   //작성자가 taskOne이 아니므로 안 지워짐
})
   