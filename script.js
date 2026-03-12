const seatArea = document.getElementById("seatArea")

let selectedSeats = []
let isAnimating = false

document.getElementById("generate").onclick = createSeats
document.getElementById("randomize").onclick = randomizeSeats
document.getElementById("reshuffle").onclick = randomizeSeats
document.getElementById("saveImage").onclick = saveImage


function createSeats(){

const rows = parseInt(document.getElementById("rows").value)
const cols = parseInt(document.getElementById("cols").value)

seatArea.innerHTML=""

seatArea.style.gridTemplateColumns=`repeat(${cols},70px)`

for(let i=0;i<rows*cols;i++){

const seat=document.createElement("div")

seat.classList.add("seat")

seat.onclick=(e)=>seatClick(e,seat)

seatArea.appendChild(seat)

}

selectedSeats=[]

}


function seatClick(e,seat){

if(e.shiftKey){

seat.classList.toggle("special")
seat.classList.remove("excluded")
return

}

if(seat.innerText!=""){

seatSwap(seat)
return

}

seat.classList.toggle("excluded")
seat.classList.remove("special")

}


function seatSwap(seat){

selectedSeats.push(seat)

seat.classList.add("selected")

if(selectedSeats.length===2){

const a=selectedSeats[0].innerText
const b=selectedSeats[1].innerText

selectedSeats[0].innerText=b
selectedSeats[1].innerText=a

selectedSeats[0].classList.remove("selected")
selectedSeats[1].classList.remove("selected")

selectedSeats=[]

}

}


function randomizeSeats(){

if(isAnimating) return

const seats=document.querySelectorAll(".seat")

if(seats.length===0){
alert("먼저 좌석을 생성하세요!")
return
}

isAnimating=true

startCountdown()
animateShuffle()

}


function startCountdown(){

const cd=document.getElementById("countdown")

let count=5

cd.style.display="block"
cd.innerText=count

const timer=setInterval(()=>{

count--

if(count<=0){

clearInterval(timer)

cd.style.display="none"

}else{

cd.innerText=count

}

},1000)

}


function animateShuffle(){

const seats=document.querySelectorAll(".seat")

let duration=5000
let start=Date.now()

let interval=setInterval(()=>{

seats.forEach(seat=>{

if(seat.classList.contains("excluded")) return

seat.innerText=Math.floor(Math.random()*99)+1

})

if(Date.now()-start>duration){

clearInterval(interval)

finalSeatAssignment()

isAnimating=false

}

},80)

}


function finalSeatAssignment(){

const start=parseInt(document.getElementById("startNum").value)
const end=parseInt(document.getElementById("endNum").value)

let numbers=[]

for(let i=start;i<=end;i++){
numbers.push(i)
}

const seats=document.querySelectorAll(".seat")

const usableSeats=[...seats].filter(s=>!s.classList.contains("excluded"))

shuffle(numbers)

const specialNumbers=document.getElementById("specialNumbers").value
.split(",")
.map(n=>parseInt(n.trim()))
.filter(n=>!isNaN(n))

let specialSeats=[]

seats.forEach(seat=>{

if(seat.classList.contains("special")){
specialSeats.push(seat)
}

seat.innerText=""

})

shuffle(specialNumbers)

specialSeats.forEach(seat=>{

if(specialNumbers.length>0){

let num=specialNumbers.pop()

seat.innerText=num

numbers=numbers.filter(n=>n!==num)

}

})

shuffle(numbers)

seats.forEach(seat=>{

if(seat.classList.contains("excluded")) return

if(seat.innerText!="") return

if(numbers.length>0){
seat.innerText=numbers.pop()
}

})

}


function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1))

const temp=array[i]

array[i]=array[j]

array[j]=temp

}

}


function saveImage(){

html2canvas(document.body).then(canvas=>{

const link=document.createElement("a")

link.download="seat.png"

link.href=canvas.toDataURL()

link.click()

})

}
