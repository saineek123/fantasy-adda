// markets.js - Part 1

// Firebase reference (agar firebase.js me initialize hai)
const db = firebase.database();


// Market data load function
function loadMarkets() {

    const marketBox = document.getElementById("marketList");

    if (!marketBox) return;

    marketBox.innerHTML = `
        <p>Loading markets...</p>
    `;


    db.ref("markets").on("value", (snapshot) => {

        marketBox.innerHTML = "";

        if (!snapshot.exists()) {
            marketBox.innerHTML = `
                <p>No markets available</p>
            `;
            return;
        }


        snapshot.forEach((child) => {

            let market = child.val();

            let id = child.key;


            let card = document.createElement("div");

            card.className = "market-card";


            card.innerHTML = `
                <h3>${market.name || "Market"}</h3>

                <p>
                    Status:
                    <b>${market.status || "Open"}</b>
                </p>

                <p>
                    Time:
                    ${market.time || "--"}
                </p>

                <button onclick="openMarket('${id}')">
                    Open
                </button>
            `;


            marketBox.appendChild(card);

        });


    });

}



// Open market page
function openMarket(id){

    localStorage.setItem("marketId", id);

    window.location.href = "market.html";

}



// Start
document.addEventListener("DOMContentLoaded", ()=>{

    loadMarkets();

});