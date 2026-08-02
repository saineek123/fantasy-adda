// =========================================
// Fantasy Adda Transaction History
// =========================================

import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const transactionList = document.getElementById("transactionList");
const filter = document.getElementById("filter");
const template = document.getElementById("transactionTemplate");

let allTransactions = [];

// ==========================
// LOGIN CHECK
// ==========================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    loadTransactions(user.uid);

});

// ==========================
// LOAD TRANSACTIONS
// ==========================

function loadTransactions(uid) {

    const txRef = ref(database, "users/" + uid + "/transactions");

    onValue(txRef, (snapshot) => {

        allTransactions = [];

        if (snapshot.exists()) {

            const data = snapshot.val();

            Object.keys(data).forEach(key => {

                allTransactions.push({

                    id: key,

                    ...data[key]

                });

            });

            // Latest First

            allTransactions.sort((a, b) => b.date - a.date);

        }

        renderTransactions();

    });

}

// ==========================
// FILTER
// ==========================

filter.addEventListener("change", renderTransactions);

// ==========================
// RENDER
// ==========================

function renderTransactions() {

    transactionList.innerHTML = "";

    const selected = filter.value;

    const list = selected === "all"

        ? allTransactions

        : allTransactions.filter(item => item.type === selected);

    if (list.length === 0) {

        transactionList.innerHTML =

        `<div class="empty">

            No Transactions Found

        </div>`;

        return;

    }

    list.forEach(item => {

        const clone = template.content.cloneNode(true);

        clone.querySelector(".type").innerText = item.type;

        clone.querySelector(".date").innerText =

            new Date(item.date).toLocaleString();

        const amount = clone.querySelector(".amount");

        amount.innerText = "₹" + item.amount;

        // =====================
        // CREDIT / DEBIT
        // =====================

        if (item.type === "Recharge" || item.type === "Win") {

            amount.classList.add("credit");

        } else {

            amount.classList.add("debit");

        }

        // =====================
        // STATUS
        // =====================

        const status = clone.querySelector(".status");

        status.innerText = item.status;

        status.classList.remove("success", "pending", "rejected");

        switch (item.status) {

            case "Success":

                status.classList.add("success");

                break;

            case "Pending":

                status.classList.add("pending");

                break;

            case "Rejected":

                status.classList.add("rejected");

                break;

        }

        // =====================
        // ICON
        // =====================

        const icon = clone.querySelector(".icon i");

        switch (item.type) {

            case "Recharge":

                icon.className = "fa fa-wallet";

                break;

            case "Withdraw":

                icon.className = "fa fa-money-bill";

                break;

            case "Trade":

                icon.className = "fa fa-chart-line";

                break;

            case "Win":

                icon.className = "fa fa-trophy";

                break;

            case "Loss":

                icon.className = "fa fa-circle-xmark";

                break;

            default:

                icon.className = "fa fa-file";

        }

        transactionList.appendChild(clone);

    });

}