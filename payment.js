import { auth, database } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
ref,
push,
set
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const amount = localStorage.getItem("depositAmount") || 0;

document.getElementById("amount").innerHTML = "₹" + amount;

onAuthStateChanged(auth, (user) => {

if (!user) return;

document.getElementById("submitBtn").onclick = async () => {

const txn = document.getElementById("txn").value.trim();

if (txn == "") {

alert("Enter Transaction ID");

return;

}

const rechargeRef = push(ref(database, "recharges"));

await set(rechargeRef, {

uid: user.uid,

amount: Number(amount),

transactionId: txn,

status: "Pending",

createdAt: Date.now()

});

alert("Recharge Request Submitted");

window.location.href = "wallet.html";

};

});