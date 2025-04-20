'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTokensToUser } from '@/lib/actions/user.actions';

const adminWalletAddress = '0x390498d0c9ea68c5467f82Eca46235B64FcCB542'; // Replace with your actual wallet address

const TokenBuyPage = () => {
  const [tokenAmount, setTokenAmount] = useState(1);
  const [ethPrice, setEthPrice] = useState(0.001);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const totalPrice = (tokenAmount * ethPrice).toFixed(4);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setConnectedAccount(accounts[0]);
      } catch (err) {
        console.error('User rejected wallet connection', err);
        toast.error('Wallet connection rejected');
      }
    } else {
      toast.error('MetaMask is not installed');
    }
  };

  const buyTokens = async () => {
    if (!connectedAccount) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsBuying(true);
    setTxHash(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: adminWalletAddress,
        value: ethers.utils.parseEther(totalPrice),
      });

      await tx.wait();
      setTxHash(tx.hash);

      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      // Add tokens to the user's database
      await addTokensToUser(userId, tokenAmount);

      toast.success('Tokens purchased and added to your account successfully!');
      setTokenAmount(1);
    } catch (err) {
      console.error('Transaction failed:', err);
      toast.error('Transaction failed. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-lg border bg-white dark:bg-gray-900 dark:border-gray-700">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Buy Tokens
      </h2>

      <label className="block mb-2 text-gray-700 dark:text-gray-300">Enter token amount:</label>
      <input
        type="number"
        value={tokenAmount}
        min={1}
        className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        onChange={(e) => setTokenAmount(Number(e.target.value))}
      />

      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Price per token: <strong>0.001 ETH</strong>
        <br />
        Total: <strong>{totalPrice} ETH</strong>
      </p>

      {!connectedAccount ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Connect MetaMask
        </button>
      ) : (
        <button
          onClick={buyTokens}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ${isBuying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isBuying}
        >
          {isBuying ? 'Processing...' : 'Buy Tokens'}
        </button>
      )}

      {connectedAccount && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Connected wallet: <span className="font-mono">{connectedAccount}</span>
        </p>
      )}

      {txHash && (
        <p className="mt-4 text-sm text-green-600 dark:text-green-400">
          ✅ Purchase successful! Tx Hash:{' '}
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-blue-400"
          >
            {txHash.slice(0, 10)}...
          </a>
        </p>
      )}
    </div>
  );
};

export default TokenBuyPage;