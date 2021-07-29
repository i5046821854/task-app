const calTip = (total, tipPerCent = .25)=> total + (total*tipPerCent)

const ftoc = (temp)=>{
    return (temp-32)/1.8
}

const ctof = (temp)=>{
    return (temp * 1.8) + 32
}

const add = (a,b) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if (a<0 || b< 0)
                return reject("number must be non-negative")
            resolve(a+b)
        },2000)
    })
}

module.exports = {
    calTip,
    ftoc,
    ctof,
    add,
}