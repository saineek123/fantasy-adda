// =====================================
// Fantasy Adda Admin Dashboard
// =====================================

import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// Dashboard Elements

const totalUsers = document.getElementById("users");
const totalRecharge = document.getElementById("recharge");
const totalWithdraw = document.getElementById("withdraw");
const totalTrades = document.getElementById("trade");
const pendingRecharge = document.getElementById("pendingRecharge");
const pendingWithdraw = document.getElementById("pendingWithdraw");
const totalMatches = document.getElementById("matches");
const totalProfit = document.getElementById("profit");


// ===============================
// USERS
// ===============================

onValue(ref(database, "users"), (snapshot) => {

    if (!snapshot.exists()) {

        totalUsers.innerText = "0";

        return;

    }

    totalUsers.innerText =
        Object.keys(snapshot.val()).length;

});


// ===============================
// RECHARGES
// ===============================

onValue(ref(database, "recharges"), (snapshot) => {

    let total = 0;
    let pending = 0;

    if (snapshot.exists()) {

        const data = snapshot.val();

        Object.values(data).forEach(item => {

            if (item.status === "Approved") {

                total += Number(item.amount);

            }

            if (item.status === "Pending") {

                pending++;

            }

        });

    }

    totalRecharge.innerText = "₹" + total;
    pendingRecharge.innerText = pending;

});


// ===============================
// WITHDRAWS
// ===============================

onValue(ref(database, "withdraws"), (snapshot) => {

    let total = 0;
    let pending = 0;

    if (snapshot.exists()) {

        const data = snapshot.val();

        Object.values(data).forEach(item => {

            if (item.status === "Approved") {

                total += Number(item.amount);

            }

            if (item.status === "Pending") {

                pending++;

            }

        });

    }

    totalWithdraw.innerText = "₹" + total;
    pendingWithdraw.innerText = pending;

});


// ===============================
// TRADES
// ===============================

onValue(ref(database, "trades"), (snapshot) => {

    if (!snapshot.exists()) {

        totalTrades.innerText = "0";

        return;

    }

    totalTrades.innerText =
        Object.keys(snapshot.val()).length;

});


// ===============================
// MATCHES
// ===============================

onValue(ref(database, "matches"), (snapshot) => {

    if (!snapshot.exists()) {

        totalMatches.innerText = "0";

        return;

    }

    totalMatches.innerText =
        Object.keys(snapshot.val()).length;

});


// ===============================
// PLATFORM PROFIT
// ===============================

function updateProfit() {

    const recharge =
        Number(totalRecharge.innerText.replace("₹", ""));

    const withdraw =
        Number(totalWithdraw.innerText.replace("₹", ""));

    totalProfit.innerText =
        "₹" + (recharge - withdraw);

}

setInterval(updateProfit, 1000);