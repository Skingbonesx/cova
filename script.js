document.addEventListener("DOMContentLoaded", function () {
    const connectWalletBtn = document.getElementById("connectWalletBtn");
    const container = document.querySelector(".container");

    async function connectWallet() {
        if (window.solana && window.solana.isPhantom) {
            try {
                const response = await window.solana.connect();
                const publicKey = response.publicKey.toString();
                console.log("Connected with public key:", publicKey);
                
                // Update button to "Create" and add click event
                connectWalletBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create`;
                connectWalletBtn.disabled = false;
                
                // Tambahkan event listener untuk redirect ke server.html
                connectWalletBtn.onclick = function () {
                    window.location.href = "server.html";
                };

                // Display wallet address in top-right corner
                let walletDisplay = document.getElementById("walletDisplay");
                if (!walletDisplay) {
                    walletDisplay = document.createElement("div");
                    walletDisplay.id = "walletDisplay";
                    walletDisplay.style.position = "absolute";
                    walletDisplay.style.top = "10px";
                    walletDisplay.style.right = "20px";
                    walletDisplay.style.background = "rgba(34, 34, 34, 0.95)";
                    walletDisplay.style.padding = "10px 15px";
                    walletDisplay.style.borderRadius = "10px";
                    walletDisplay.style.color = "#FFA500";
                    walletDisplay.style.fontFamily = "Courier New, monospace";
                    walletDisplay.style.fontSize = "0.9em";
                    walletDisplay.style.boxShadow = "0 0 10px rgba(255, 165, 0, 0.2)";
                    container.appendChild(walletDisplay);
                }
                walletDisplay.innerHTML = `Wallet: ${publicKey.substring(0, 6)}...${publicKey.slice(-4)}`;
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Phantom Wallet not detected. Please install Phantom Wallet.");
            window.open("https://phantom.app", "_blank");
        }
    }

    connectWalletBtn.addEventListener("click", connectWallet);
});
