const amountInput = document.getElementById("amount");

const buttons = document.querySelectorAll(".quick-btn");

buttons.forEach(btn=>{

btn.onclick=()=>{

buttons.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

amountInput.value=btn.innerText;

}

});

document.getElementById("continueBtn")

.onclick=()=>{

const amount=parseInt(amountInput.value);

if(isNaN(amount)||amount<100){

alert("Minimum Add Money ₹100");

return;

}

// Next Step

localStorage.setItem("depositAmount",amount);

window.location.href="payment.html";

}