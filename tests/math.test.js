const { calTip, ctof, ftoc, add } = require('../src/math')

test('cal total', ()=>{ //1st : 테스트 케이스 이름 , 2nd: 테스트 케이스 검사 함수, 여기서 에러를 throw하면 fail
    const total = calTip(10,3)
    expect(total).toBe(40)  //expect().toBe를 사용하여 total이 13인지 검사. 아니라면 에러 던짐
    //if(total !== 40)   //expect를 써주면 따로 error를 throw해줄 필요 없음
        //throw new Error('Total tip should be 13. but got ' + total)

})  //test: 테스트를 하기 위해서 호출해줘야하는 함수

test('cal total with default tip', ()=>{
    const total = calTip(10) //without 2nd paramof calTip
    expect(total).toBe(12.5)
})

test("ctof", ()=>{
    const result = ctof(10)
    expect(result).toBe(50)
})

test("ftoc", ()=>{
    const result =  ftoc(50)
    expect(result).toBe(10)
})

test("async test", (next)=>{   //async한 함수를 test하기 위해서 next 함수를 파라미터로 넣어줌
    setTimeout(()=>{
        expect(1).toBe(1)
        next()  //얘가 실행되어야지 pass가 나오도록
    },1000)
})

test("should add two numbers", (done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})

test("should add two numbers async/await", async ()=>{   //test도 async/await을 사용할 수 있음 / 이 경우에는 next() 함수를 안 저도 됨
    const sum = await add(2,3)
    expect(sum).toBe(5)
})