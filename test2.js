// const obj = {
//         "1. willson":"Anmol",
//         age:"Age"
// };

// let j = '';
// for(let i in obj){
//         j = `${j+i}\n`;
        
// }

// const i = (j.trim().split(" " && "\n"))
// console.log(i)
// console.log(i.includes('willson'))
// // const j = "Hello World"
// // console.log(j.split(' '))



// const j = "yes :10";
// console.log(j.trim().split(':').includes('yes'))
// const i = ["yes","322"]

// const i = "yes:10"
// console.log(i.includes(':'))
// const j = i.split(":")



// const a = {
//     1 : "Hehe"
// };
// console.log(a[0])




// let intervalid = null;

// function startinterval(){
//     if(intervalid !== null) return;

//     intervalid = setInterval(()=>{console.log("Hello")}, 2000);
// }
// function pauseinterval(){
//     clearInterval(intervalid);
//     intervalid = null;
// }

// function main(){
//     startinterval();
//     setTimeout(()=>{
//         console.log("Pausing...")
//         pauseinterval()
//     },10000)
//     setTimeout(()=>{console.log("Restarting...")
//         startinterval()
//     }, 20000)
// }

// main()

const a = {
    1: "Hehe",
    2: "Hmm"
}

console.log(Object.keys(a).length)