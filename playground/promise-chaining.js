require('../src/db/mongoose')
const User = require('../src/models/users')

const updateAgeAndCount = async(id, age) =>{
    const user = await User.findByIdAndUpdate(id, {age}) //{age : age}를 간편하게 표헌 / 비동기적으로 처리됨
    const count = await User.countDocuments({age})  //promise chaining과 같은 효과
    return count
}

updateAgeAndCount('60f586a2dedafa3898ab4513',3).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})


// User.findByIdAndUpdate('60f586a2dedafa3898ab4513', {age:1}).then((user)=>{ //mongoose에서는 $set 안 써줘도 됨
//     console.log(user)
//     return User.countDocuments({age:1}) //도큐먼트의 수를 셈
// }).then((result)=>{  //promise chaining
//     console.log(result)
// }).catch((e)=>{ //countDocument와 findbyIDUpdate에서 발생한 에러를 모두 찾아냄
//     console.log(e)
// }) 
