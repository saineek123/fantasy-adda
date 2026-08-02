// =======================================
// Fantasy Adda - Add Match
// =======================================

import { database } from "./firebase.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// ============================
// Elements
// ============================

const league = document.getElementById("league");
const sport = document.getElementById("sport");

const teamA = document.getElementById("teamA");
const teamB = document.getElementById("teamB");

const teamALogo = document.getElementById("teamALogo");
const teamBLogo = document.getElementById("teamBLogo");

const teamAImg = document.getElementById("teamAImg");
const teamBImg = document.getElementById("teamBImg");

const venue = document.getElementById("venue");
const matchTime = document.getElementById("matchTime");
const status = document.getElementById("status");
const matchBanner = document.getElementById("matchBanner");

const saveBtn = document.getElementById("saveMatch");
const successMsg = document.getElementById("successMsg");

// ============================
// Live Logo Preview
// ============================

teamALogo.addEventListener("input", () => {

    teamAImg.src =
        teamALogo.value || "../assets/default-team.png";

});

teamBLogo.addEventListener("input", () => {

    teamBImg.src =
        teamBLogo.value || "../assets/default-team.png";

});

// ============================
// Create Match
// ============================

saveBtn.addEventListener("click", async () => {

    // Validation

    if (
        league.value.trim() === "" ||
        teamA.value.trim() === "" ||
        teamB.value.trim() === "" ||
        venue.value.trim() === "" ||
        matchTime.value === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }

    try {

        // New Match ID

        const matchRef = push(ref(database, "matches"));

        // Save Match

        await set(matchRef, {

            matchId: matchRef.key,

            league: league.value.trim(),

            sport: sport.value,

            teamA: teamA.value.trim(),

            teamB: teamB.value.trim(),

            teamALogo:
                teamALogo.value.trim(),

            teamBLogo:
                teamBLogo.value.trim(),

            venue: venue.value.trim(),

            banner:
                matchBanner.value.trim(),

            matchTime: matchTime.value,

            status: status.value,

            createdAt: Date.now(),

            // Default Markets

            markets: {

                matchWinner: {

                    title: "Match Winner",

                    active: true

                },

                tossWinner: {

                    title: "Toss Winner",

                    active: true

                },

                totalRuns: {

                    title: "Total Runs",

                    active: true

                },

                playerRuns: {

                    title: "Player Runs",

                    active: true

                },

                playerWickets: {

                    title: "Player Wickets",

                    active: true

                },

                playerSixes: {

                    title: "Player Sixes",

                    active: true

                }

            }

        });

        successMsg.style.display = "block";

        // Reset Form

        league.value = "";
        sport.value = "Cricket";

        teamA.value = "";
        teamB.value = "";

        teamALogo.value = "";
        teamBLogo.value = "";

        venue.value = "";
        matchTime.value = "";
        matchBanner.value = "";

        status.value = "Upcoming";

        teamAImg.src = "../assets/default-team.png";
        teamBImg.src = "../assets/default-team.png";

        setTimeout(() => {

            window.location.href = "matches.html";

        }, 1500);

    }

    catch (error) {

        console.error(error);

        alert("Failed to create match.");

    }

});