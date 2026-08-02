// ======================================
// Fantasy Adda Match Management
// Part 1
// ======================================

import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// =============================
// Elements
// =============================

const matchList = document.getElementById("matchList");
const template = document.getElementById("matchTemplate");

const searchBox = document.getElementById("searchMatch");
const statusFilter = document.getElementById("filterStatus");

let allMatches = [];

// =============================
// Load Matches
// =============================

onValue(ref(database, "matches"), (snapshot) => {

    allMatches = [];

    if (snapshot.exists()) {

        const data = snapshot.val();

        Object.keys(data).forEach(key => {

            allMatches.push({

                id: key,

                ...data[key]

            });

        });

        // Latest Match First

        allMatches.sort((a, b) => b.createdAt - a.createdAt);

    }

    renderMatches();

});

// =============================
// Search & Filter
// =============================

searchBox.addEventListener("keyup", renderMatches);

statusFilter.addEventListener("change", renderMatches);

// =============================
// Render Match
// =============================

function renderMatches() {

    matchList.innerHTML = "";

    const search =
        searchBox.value.toLowerCase();

    const status =
        statusFilter.value;

    let filtered = allMatches.filter(match => {

        const matchSearch =

            match.teamA.toLowerCase().includes(search) ||

            match.teamB.toLowerCase().includes(search) ||

            match.league.toLowerCase().includes(search);

        const matchStatus =

            status === "All"

            ||

            match.status === status;

        return matchSearch && matchStatus;

    });

    if (filtered.length === 0) {

        matchList.innerHTML =

        `<div class="empty">

            No Matches Found

        </div>`;

        return;

    }

    filtered.forEach(match => {

        const clone =
            template.content.cloneNode(true);

        clone.querySelector(".leagueName").innerText =
            match.league;

        clone.querySelector(".teamA").innerText =
            match.teamA;

        clone.querySelector(".teamB").innerText =
            match.teamB;

        clone.querySelector(".venue").innerText =
            match.venue;

        clone.querySelector(".sport").innerText =
            match.sport;

        clone.querySelector(".time").innerText =
            new Date(match.matchTime).toLocaleString();

        // Logos

        clone.querySelector(".teamALogo").src =
            match.teamALogo || "../assets/default-team.png";

        clone.querySelector(".teamBLogo").src =
            match.teamBLogo || "../assets/default-team.png";

        // Banner

        clone.querySelector(".bannerImg").src =
            match.banner || "../assets/default-banner.jpg";

        // Status

        const badge =
            clone.querySelector(".statusBadge");

        badge.innerText = match.status;

        badge.className =
            "statusBadge " +
            match.status.toLowerCase();

        // Buttons me Match ID Save

        clone.querySelector(".liveBtn").dataset.id =
            match.id;

        clone.querySelector(".marketBtn").dataset.id =
            match.id;

        clone.querySelector(".resultBtn").dataset.id =
            match.id;

        clone.querySelector(".editBtn").dataset.id =
            match.id;

        clone.querySelector(".deleteBtn").dataset.id =
            match.id;

        matchList.appendChild(clone);

    });
// ======================================
// PART 2
// Match Actions
// ======================================

import {
    update,
    remove,
    ref
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// ======================================
// Button Events
// ======================================

document.addEventListener("click", async (e) => {

    // ==========================
    // GO LIVE BUTTON
    // ==========================

    if (e.target.closest(".liveBtn")) {

        const id = e.target.closest(".liveBtn").dataset.id;

        const confirmLive =
            confirm("Start this match?");

        if (!confirmLive) return;

        try {

            await update(
                ref(database, "matches/" + id),
                {
                    status: "Live"
                }
            );

            alert("✅ Match is now LIVE");

        } catch (err) {

            console.error(err);

            alert("Unable to start match.");

        }

    }

    // ==========================
    // EDIT MATCH
    // ==========================

    if (e.target.closest(".editBtn")) {

        const id =
            e.target.closest(".editBtn").dataset.id;

        window.location.href =
            "edit-match.html?id=" + id;

    }

    // ==========================
    // DELETE MATCH
    // ==========================

    if (e.target.closest(".deleteBtn")) {

        const id =
            e.target.closest(".deleteBtn").dataset.id;

        const ok =
            confirm("Delete this match permanently?");

        if (!ok) return;

        try {

            await remove(
                ref(database, "matches/" + id)
            );

            alert("🗑 Match Deleted");

        }

        catch (err) {

            console.error(err);

            alert("Delete Failed");

        }

    }

});
// ======================================
// PART 3
// Markets & Result
// ======================================

document.addEventListener("click", async (e) => {

    // ==========================
    // MARKETS
    // ==========================

    if (e.target.closest(".marketBtn")) {

        const id =
            e.target.closest(".marketBtn").dataset.id;

        window.location.href =
            "markets.html?id=" + id;

    }

    // ==========================
    // RESULT
    // ==========================

    if (e.target.closest(".resultBtn")) {

        const id =
            e.target.closest(".resultBtn").dataset.id;

        window.location.href =
            "results.html?id=" + id;

    }

});
}