// ==========================================
// Fantasy Adda Admin Withdraw Panel
// ==========================================

import { database } from "./firebase.js";

import {
    ref,
    onValue,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const withdrawList = document.getElementById("withdrawList");

const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");

const template = document.getElementById("withdrawTemplate");

onValue(ref(database, "withdraws"), async (snapshot) => {

    withdrawList.innerHTML = "";

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    if (!snapshot.exists()) {

        withdrawList.innerHTML =
        "<h3>No Withdraw Requests</h3>";

        return;

    }

    const data = snapshot.val();

    for (const withdrawId in data) {

        const withdraw = data[withdrawId];

        if (withdraw.status === "Pending") pending++;
        if (withdraw.status === "Approved") approved++;
        if (withdraw.status === "Rejected") rejected++;

        const clone =
        template.content.cloneNode(true);

        // User Details

        const userSnap = await get(
            ref(database, "users/" + withdraw.uid)
        );

        let userName = "Unknown";
        let userEmail = "-";

        if (userSnap.exists()) {

            const user = userSnap.val();

            userName = user.name || "User";
            userEmail = user.email || "-";

        }

        clone.querySelector(".userName").innerText = userName;
        clone.querySelector(".userEmail").innerText = userEmail;
        clone.querySelector(".uid").innerText = withdraw.uid;
        clone.querySelector(".amount").innerText = withdraw.amount;
        clone.querySelector(".upi").innerText = withdraw.upi;
        clone.querySelector(".date").innerText =
            new Date(withdraw.createdAt).toLocaleString();

        const statusEl = clone.querySelector(".status");
        statusEl.innerText = withdraw.status;
        statusEl.className = "status " + withdraw.status.toLowerCase();

        // ======================
        // APPROVE
        // ======================

        clone.querySelector(".approve").onclick = async () => {

            if (withdraw.status !== "Pending") {

                alert("Request already processed.");
                return;

            }

            const walletRef =
                ref(database,
                    "users/" + withdraw.uid + "/wallet");

            const walletSnap =
                await get(walletRef);

            if (!walletSnap.exists()) {

                alert("Wallet not found");
                return;

            }

            const wallet = walletSnap.val();

            const winning =
                Number(wallet.winning || 0);

            if (winning < withdraw.amount) {

                alert("Insufficient Winning Balance");

                return;

            }

            // Wallet Update

            await update(walletRef, {

                winning:
                winning - Number(withdraw.amount)

            });

            // Withdraw Status

            await update(
                ref(database,
                    "withdraws/" + withdrawId),

                {

                    status: "Approved"

                }

            );

            // Transaction Update

            const txSnap = await get(
                ref(database,
                    "users/" +
                    withdraw.uid +
                    "/transactions")
            );

            if (txSnap.exists()) {

                const txData = txSnap.val();

                for (const txId in txData) {

                    const tx = txData[txId];

                    if (
                        tx.type === "Withdraw" &&
                        tx.amount == withdraw.amount &&
                        tx.status === "Pending"
                    ) {

                        await update(

                            ref(database,

                                "users/" +
                                withdraw.uid +
                                "/transactions/" +
                                txId),

                            {

                                status: "Success"

                            }

                        );

                    }

                }

            }

            alert("Withdraw Approved");

        };

        // ======================
        // REJECT
        // ======================

        clone.querySelector(".reject").onclick =
        async () => {

            if (withdraw.status !== "Pending") {

                alert("Request already processed.");

                return;

            }

            await update(

                ref(database,
                    "withdraws/" + withdrawId),

                {

                    status: "Rejected"

                }

            );

            // Transaction Update

            const txSnap = await get(
                ref(database,
                    "users/" +
                    withdraw.uid +
                    "/transactions")
            );

            if (txSnap.exists()) {

                const txData = txSnap.val();

                for (const txId in txData) {

                    const tx = txData[txId];

                    if (
                        tx.type === "Withdraw" &&
                        tx.amount == withdraw.amount &&
                        tx.status === "Pending"
                    ) {

                        await update(

                            ref(database,

                                "users/" +
                                withdraw.uid +
                                "/transactions/" +
                                txId),

                            {

                                status: "Rejected"

                            }

                        );

                    }

                }

            }

            alert("Withdraw Rejected");

        };

        withdrawList.appendChild(clone);

    }

    pendingCount.innerText = pending;
    approvedCount.innerText = approved;
    rejectedCount.innerText = rejected;

});