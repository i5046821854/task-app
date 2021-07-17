// const mongoDB = require('mongodb')
// const MongoClient = mongoDB.MongoClient  //몽고db의 함수들에 접근할 수 있는 클라이언트 생성
// const ObjectID = mongoDB.ObjectId

const {MongoClient, ObjectId} = require('mongodb') //위에 세줄을 destructuring 한 것

const connectionURL = 'mongodb://127.0.0.1:27017' //로컬호스트로 연결 (localhost:27017로 쓰면 에러 발생 우려)
const databaseName = 'task-manager'

//몽고디비의 id값 생성 방식 확인
const id = new ObjectId()  
console.log(id, id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client) =>{  //비동기적으로 진행됨
    if(error){
        return console.log('unable to connect to db')
    }

    const db = client.db(databaseName)  //자동적으로 task-manager라는 db생성됨 
    
    //하나의 도큐먼트를 저장
    db.collection('users').insertOne({   //콜렉션을 하나 만들어서 그 콜렉션에 하나의 도큐먼트를 넣어줌
        _id : id, //id값을 manually 설정 가능
        name : 'lee',
        age : 65
    }, (error, result) =>{
        if(error){
            return console.log('unable to insert')
        }
        console.log('ehll')
        console.log(result.insertedId) //result.insertedId는 지금까지 저장된 도큐먼트의 id
    }) //insertion은 비동기적으로 처리되므로 콜백
   
    //여러 도큐먼트를 저장
    db.collection('users').insertMany([{   
        name:'jen',
        age: 28
    }, {
        name: 'hunter',
        age : 68
    }],(error, result) =>{
        if(error){
            return console.log('unable to insert')
        }
        console.log(result.insertedIds)
    } )

    db.collection('task').insertMany([
        {
            description: "dish",
            completed : true
        },        {
            description: "cook",
            completed : false
        },        {
            description: "baby",
            completed : true
        }
    ], (error, result) =>{
        if(error)
            return console.log("unable to insert")
        console.log(result.insertedIds)
    })
}) //1 param : 연결할 url / 2 param 연결의 옵션 (uerNewURLParser : default= deprecated => true로 바꿔주면서 url을 정확하게 파싱할 수 있도록) / 3 parma : 콜백 : 디비에 연결되면 실행할 코드
