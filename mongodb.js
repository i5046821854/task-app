// const mongoDB = require('mongodb')
// const MongoClient = mongoDB.MongoClient  //몽고db의 함수들에 접근할 수 있는 클라이언트 생성
// const ObjectID = mongoDB.ObjectId

const {MongoClient, ObjectId} = require('mongodb') //위에 세줄을 destructuring 한 것

const connectionURL = 'mongodb://127.0.0.1:27017' //로컬호스트로 연결 (localhost:27017로 쓰면 에러 발생 우려)
const databaseName = 'task-manager'

/*
//몽고디비의 id값 생성 방식 확인
const id = new ObjectId()  
console.log(id, id.getTimestamp())
*/

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client) =>{  //비동기적으로 진행됨
    if(error){
        return console.log('unable to connect to db')
    }

    const db = client.db(databaseName)  //자동적으로 task-manager라는 db생성됨 
    
    ///create
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

    ///특정한 도큐먼트를 찾아내기
    db.collection('users').findOne({ _id : new ObjectId("60f288491fa69a2c4f208178")}, (error, user)=>{ //1 param에 해당하는 도큐먼트를 하나만 찾아냄 (가장 먼저 발견되는 도큐먼트만), id로 찾아내고 싶을 때는 objectID()를 사용해서 바이너리 코드로 변환될 수 있게 래핑해줘야함 
        if(error)
            return console.log("unable to find")
        console.log(user)
    })
    
    db.collection('users').find({age : 65}).toArray((error, users) => {  //하지만 to array함수에 콜백이 있음 (toArray: 포인터들의 배열)
        if(error)
            return console.log("unable to find")
        console.log(users)

    }) //여러 도큐먼트를 찾을 때 사용 / callback이 따로 없고, 반환 값으로 cursor(데이터베이스에서 해당 도큐먼트가 위치하는 포인터) 반환 

    db.collection('users').find({age : 65}).count((error, count) => { //조건을 만족하는 도큐먼트의 수를 찾아냄
        if(error)
            return console.log("unable to find")
        console.log(count)
    })

    db.collection('task').findOne({ _id : new ObjectId("60f290f542608b19c4462e48")}, (error, task) =>{
        if(error)
            return console.log("unable to find")
        console.log(task)
    })

    db.collection('task').find({completed : true}).toArray((error, tasks) =>
    {
        if(error)
            return console.log('unable to find')
        console.log(tasks)
    })

    ///update
    db.collection('users').updateOne({   //update에 콜백 쓸 수 도 있음 / 콜백 없으면 promise 문법으로 
        _id: new ObjectId("60f288491fa69a2c4f208178")  //바꿈 대상
    }, { //무엇으로 바꿀것인지
        $set:{   //바꾸고 싶은 것 : $set{key: value} 형식으로
            name: 'kim'
        },
        $inc:{   //증가시키고 싶은 필드값
            age: -2
        }
    }).then((result) =>{  //업데이트 되면 실행됨
        console.log(result)
    }).catch((error) =>{
        console.log(error)
    })

    db.collection('task').updateMany({   //여러개를 업데이트 하고 싶을 때
        completed: false 
    },
    {
        $set :{
            completed: true
        }
    }).then((result)=>{
        console.log(result.modifiedCount)
    }).catch((error)=>{
        console.log(error)
    })


    ///delete
    db.collection('users').deleteMany({  //여러개
        name: 'lee'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

    db.collection('task').deleteOne({  //한개
        description: 'dish'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
}) //1 param : 연결할 url / 2 param 연결의 옵션 (uerNewURLParser : default= deprecated => true로 바꿔주면서 url을 정확하게 파싱할 수 있도록) / 3 parma : 콜백 : 디비에 연결되면 실행할 코드
