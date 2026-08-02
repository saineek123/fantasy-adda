// =====================================
// Fantasy Adda Withdraw System
// =====================================

import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    ref,
    get,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

let currentUser = null;
let winningBalance = 0;

// =====================================
// LOAD USER DATA
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    const userRef = ref(database, "users/" + user.uid);

    const snapshot = await get(userRef);

    if (!snapshot.exists()) return;

    const data = snapshot.val();

    winningBalance = Number(data.wallet?.winning || 0);

    document.getElementById("winningBalance").innerHTML =
        "₹" + winningBalance;

});


// =====================================
// WITHDRAW REQUEST
// =====================================

document.getElementById("withdrawBtn")
.addEventListener("click", async () => {

    const amount = Number(
        document.getElementById("amount").value
    );

    const upi = document
        .getElementById("upi")
        .value
        .trim();

    // Validation

    if (!amount || amount <= 0) {

        alert("Enter Withdraw Amount");
        return;

    }

    if (amount < 100) {

        alert("Minimum Withdraw ₹100");
        return;

    }

    if (amount > winningBalance) {

        alert("Insufficient Winning Balance");
        return;

    }

    if (upi == "") {

        alert("Enter UPI ID");
        return;

    }

    // Create Withdraw Request

    const withdrawRef =
        push(ref(database, "withdraws"));

    await set(withdrawRef, {

        withdrawId: withdrawRef.key,

        uid: currentUser.uid,

        amount: amount,

        upi: upi,

        status: "Pending",

        createdAt: Date.now()

    });

    // Transaction History

    const txRef =
        push(ref(database,
            "users/" +
            currentUser.uid +
            "/transactions"));

    await set(txRef, {

        type: "Withdraw",

        amount: amount,

        status: "Pending",

        date: Date.now()

    });

    alert("Withdraw Request Submitted");

    document.getElementById("amount").value = "";
    document.getElementById("upi").value = "";

});