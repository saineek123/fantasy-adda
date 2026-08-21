<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fantasy Adda</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: #f5f6fa; padding-bottom: 80px; }
        header { background: #B80000; color: #fff; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 3px 10px rgba(0,0,0,.15); }
        .logo { font-size: 22px; font-weight: 700; }
        .profile a { color: #fff; font-size: 22px; }
        .banner { margin: 20px; padding: 30px 20px; background: linear-gradient(135deg, #B80000, #ff4d4d); color: #fff; border-radius: 18px; text-align: center; }
        .banner h1 { font-size: 26px; margin-bottom: 10px; }
        .banner p { font-size: 16px; margin-bottom: 20px; }
        .banner a { display: inline-block; background: #fff; color: #B80000; padding: 12px 25px; border-radius: 30px; text-decoration: none; font-weight: bold; }
        .wallet-card { margin: 20px; background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,.08); }
        .wallet-card h3 { margin-bottom: 15px; color: #333; }
        .wallet { display: flex; justify-content: space-between; align-items: center; }
        .wallet p { color: #777; }
        .wallet h2 { color: #B80000; margin-top: 5px; }
        .wallet a i { background: #B80000; color: #fff; padding: 18px; border-radius: 50%; font-size: 22px; }
        .wallet a { text-decoration: none; }
        .menu { margin: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .menu a { background: #fff; padding: 15px 5px; text-align: center; text-decoration: none; color: #333; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,.08); }
        .menu i { display: block; font-size: 22px; color: #B80000; margin-bottom: 8px; }
        .menu span { font-size: 13px; font-weight: 600; }
        .section { margin: 20px; }
        .section h2 { margin-bottom: 15px; color: #222; }
        .match-card { background: #fff; padding: 15px; border-radius: 15px; margin-bottom: 15px; box-shadow: 0 3px 10px rgba(0,0,0,.08); }
        .match-card .teams { display: flex; justify-content: space-between; align-items: center; }
        .team { text-align: center; }
        .team img { width: 55px; height: 55px; border-radius: 50%; object-fit: contain; }
        .vs { font-weight: bold; color: #B80000; }
        .tradeBtn { display: block; width: 100%; margin-top: 12px; padding: 10px; background: #B80000; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
        .tradeBtn:hover { background: #990000; }
        .empty { text-align: center; color: #777; padding: 30px 0; }
        nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #fff; display: flex; justify-content: space-around; padding: 12px 0; box-shadow: 0 -3px 10px rgba(0,0,0,.12); }
        nav a { text-decoration: none; color: #666; font-size: 12px; text-align: center; }
        nav i { display: block; font-size: 20px; margin-bottom: 5px; color: #B80000; }
        .toast { position: fixed; top: 20px; right: 20px; background: #333; color: #fff; padding: 15px 25px; border-radius: 12px; z-index: 1000; display: none; animation: slideIn 0.4s ease; max-width: 350px; }
        .toast.success { background: #28a745; }
        .toast.error { background: #d40000; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media(max-width:600px) { .banner h1 { font-size: 22px; } .menu { grid-template-columns: repeat(4, 1fr); } .menu i { font-size: 19px; } .wallet h2 { font-size: 24px; } }
    </style>
</head>
<body>
    <header>
        <div class="logo">🏏 Fantasy Adda</div>
        <div class="profile"><a href="profile.html"><i class="fa-solid fa-user"></i></a></div>
    </header>
    <section class="banner">
        <h1>Trade Your Sports Knowledge</h1>
        <p>Predict • Trade • Win</p>
        <a href="matches.html">View Matches</a>
    </section>
    <section class="wallet-card">
        <h3>My Wallet</h3>
        <div class="wallet">
            <div><p>Total Balance</p><h2 id="balance">₹0</h2></div>
            <a href="wallet.html"><i class="fa-solid fa-wallet"></i></a>
        </div>
    </section>
    <section class="menu">
        <a href="matches.html"><i class="fa-solid fa-trophy"></i><span>Matches</span></a>
        <a href="trade-history.html"><i class="fa-solid fa-chart-line"></i><span>My Trades</span></a>
        <a href="transaction.html"><i class="fa-solid fa-clock-rotate-left"></i><span>History</span></a>
        <a href="wallet.html"><i class="fa-solid fa-money-bill"></i><span>Wallet</span></a>
    </section>
    <section class="section">
        <h2>🔥 Live Matches</h2>
        <div id="liveMatches"></div>
    </section>
    <nav>
        <a href="index.html"><i class="fa fa-home"></i>Home</a>
        <a href="matches.html"><i class="fa fa-trophy"></i>Matches</a>
        <a href="wallet.html"><i class="fa fa-wallet"></i>Wallet</a>
        <a href="profile.html"><i class="fa fa-user"></i>Profile</a>
    </nav>
    <div class="toast" id="toast"><i class="fa fa-check-circle"></i><span id="toastMessage">Success!</span></div>
    <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-database-compat.js"></script>
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyACztDFFn-xL75-32PYd1vsyjHKBod-UzA",
            authDomain: "fantasy-adda-e3b72.firebaseapp.com",
            projectId: "fantasy-adda-e3b72",
            storageBucket: "fantasy-adda-e3b72.firebasestorage.app",
            messagingSenderId: "882657286194",
            appId: "1:882657286194:web:284e818359de2363f0442b",
            measurementId: "G-8HJX9NRL1B"
        };
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();
        const balanceBox = document.getElementById("balance");
        const liveMatches = document.getElementById("liveMatches");
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        let toastTimeout;

        function showToast(msg, type = 'success') {
            toast.className = 'toast ' + type;
            toastMessage.textContent = msg;
            toast.style.display = 'block';
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 3000);
        }

        auth.onAuthStateChanged((user) => {
            if (!user) { window.location.href = "login.html"; return; }
            loadWallet(user.uid);
        });

        function loadWallet(uid) {
            database.ref("users/" + uid + "/wallet").on('value', (snapshot) => {
                if (snapshot.exists()) { const wallet = snapshot.val(); balanceBox.innerText = "₹" + (wallet.balance || 0); }
                else { balanceBox.innerText = "₹0"; }
            });
        }

        database.ref("matches").on('value', (snapshot) => {
            liveMatches.innerHTML = "";
            if (!snapshot.exists()) { liveMatches.innerHTML = `<div class="empty">No Live Matches</div>`; return; }
            const matches = snapshot.val();
            Object.keys(matches).forEach((id) => {
                const match = matches[id];
                if (match.status === "Live" || match.status === "Upcoming") { createMatchCard(id, match); }
            });
        });

        function createMatchCard(id, match) {
            const card = document.createElement("div");
            card.className = "match-card";
            card.innerHTML = `
                <div class="teams">
                    <div class="team"><img src="${match.teamALogo || 'assets/default-team.png'}" alt="${match.teamA}"><p>${match.teamA}</p></div>
                    <div class="vs">VS</div>
                    <div class="team"><img src="${match.teamBLogo || 'assets/default-team.png'}" alt="${match.teamB}"><p>${match.teamB}</p></div>
                </div>
                <p style="text-align:center;margin-top:10px;color:#777">${match.league}</p>
                <button class="tradeBtn">Trade Now</button>
            `;
            card.querySelector(".tradeBtn").addEventListener("click", () => { window.location.href = "trade.html?id=" + id; });
            liveMatches.appendChild(card);
        }
    </script>
</body>
</html>
