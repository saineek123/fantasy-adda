import { auth, database } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
ref,
onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

onAuthStateChanged(auth,(user)=>{

if(!user)return;

const walletRef=ref(database,"users/"+user.uid+"/wallet");

onValue(walletRef,(snapshot)=>{

if(snapshot.exists()){

const data=snapshot.val();

const recharge=data.recharge||0;

const winning=data.winning||0;

const bonus=data.bonus||0;

document.getElementById("recharge").innerHTML="₹"+recharge;

document.getElementById("winning").innerHTML="₹"+winning;

document.getElementById("bonus").innerHTML="₹"+bonus;

document.getElementById("totalBalance").innerHTML=

"₹"+(recharge+winning+bonus);

}

});

});