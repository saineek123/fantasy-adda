// =======================================
// Admin Recharge Panel
// =======================================

import { database } from "./firebase.js";

import {
    ref,
    onValue,
    get,
    update,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const rechargeList = document.getElementById("rechargeList");

const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");

const template = document.getElementById("rechargeTemplate");

onValue(ref(database, "recharges"), async (snapshot) => {

    rechargeList.innerHTML = "";

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    if (!snapshot.exists()) {

        rechargeList.innerHTML =
        "<h3>No Recharge Requests</h3>";

        return;

    }

    const data = snapshot.val();

    for (const rechargeId in data) {

        const recharge = data[rechargeId];

        if (recharge.status === "Pending") pending++;
        if (recharge.status === "Approved") approved++;
        if (recharge.status === "Rejected") rejected++;

        const clone =
        template.content.cloneNode(true);

        const userSnap = await get(
            ref(database, "users/" + recharge.uid)
        );

        let userName = "Unknown";
        let userEmail = "-";

        if (userSnap.exists()) {

            const user = userSnap.val();

            userName = user.name;
            userEmail = user.email;

        }

        clone.querySelector(".userName").innerText = userName;
        clone.querySelector(".userEmail").innerText = userEmail;
        clone.querySelector(".uid").innerText = recharge.uid;
        clone.querySelector(".amount").innerText = recharge.amount;
        clone.querySelector(".txn").innerText = recharge.transactionId;

        clone.querySelector(".date").innerText =
        new Date(recharge.createdAt).toLocaleString();

        clone.querySelector(".status").innerText =
        recharge.status;

        // =====================
        // APPROVE
        // =====================

        clone.querySelector(".approve").onclick =
        async () => {

            const walletRef =
            ref(database,
            "users/" + recharge.uid + "/wallet");

            const walletSnap =
            await get(walletRef);

            if (!walletSnap.exists()) return;

            const wallet = walletSnap.val();

            const newRecharge =
            (wallet.recharge || 0)
            + Number(recharge.amount);

            await update(walletRef, {

                recharge: newRecharge

            });

            await update(
                ref(database,
                "recharges/" + rechargeId),

                {
                    status: "Approved"
                }
            );

            // Transaction History

            const txRef =
            push(ref(database,
            "users/" + recharge.uid +
            "/transactions"));

            await set(txRef, {

                type: "Recharge",

                amount: recharge.amount,

                status: "Success",

                date: Date.now()

            });

            alert("Recharge Approved");

        };

        // =====================
        // REJECT
        // =====================

        clone.querySelector(".reject").onclick =
        async () => {

            await update(
                ref(database,
                "recharges/" + rechargeId),

                {
                    status: "Rejected"
                }
            );

            alert("Recharge Rejected");

        };

        rechargeList.appendChild(clone);

    }

    pendingCount.innerText = pending;
    approvedCount.innerText = approved;
    rejectedCount.innerText = rejected;

});