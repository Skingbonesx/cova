document.addEventListener("DOMContentLoaded", function () {
    const connectWalletBtn = document.getElementById("connectWalletBtn");

    async function connectWallet() {
        if (window.solana && window.solana.isPhantom) {
            try {
                const response = await window.solana.connect();
                console.log("Connected with public key:", response.publicKey.toString());
                connectWalletBtn.innerHTML = `<i class="fas fa-check-circle"></i> Connected`;
                connectWalletBtn.disabled = true;
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
