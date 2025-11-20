// ============================================
// VÍ DỤ REACT COMPONENT
// ============================================

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x33878ec7Fa1AAB43f2c4D0F7996FB4a34E87c182';
const CONTRACT_ABI = [/* ... ABI ... */];

function CharityApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kết nối ví
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS, 
          CONTRACT_ABI, 
          signer
        );
        
        setAccount(accounts[0]);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  // Tạo quỹ
  const handleCreateFund = async () => {
    if (!contract) {
      alert('Vui lòng kết nối ví trước!');
      return;
    }

    const title = prompt('Nhập tên quỹ:');
    if (!title) return;

    setLoading(true);
    try {
      const tx = await contract.createFund(title, '');
      await tx.wait();
      alert('Tạo quỹ thành công!');
      // Refresh danh sách quỹ
      loadFunds();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quyên góp
  const handleDonate = async (fundId, amount) => {
    if (!contract) {
      alert('Vui lòng kết nối ví trước!');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.donate(fundId, {
        value: ethers.parseEther(amount.toString())
      });
      await tx.wait();
      alert('Quyên góp thành công!');
      loadFunds();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách quỹ từ backend
  const loadFunds = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/funds');
      const data = await response.json();
      setFunds(data.funds || []);
    } catch (error) {
      console.error('Error loading funds:', error);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  return (
    <div>
      <h1>Quỹ Từ Thiện</h1>
      
      {!account ? (
        <button onClick={connectWallet}>
          Kết nối Ví (MetaMask)
        </button>
      ) : (
        <div>
          <p>Đã kết nối: {account}</p>
          <button onClick={handleCreateFund} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Tạo Quỹ Mới'}
          </button>
        </div>
      )}

      <h2>Danh sách Quỹ</h2>
      {funds.map(fund => (
        <div key={fund.fundId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{fund.title}</h3>
          <p>Chủ quỹ: {fund.owner}</p>
          <p>Tổng quyên góp: {ethers.formatEther(fund.totalReceived)} ETH</p>
          <p>Số dư: {ethers.formatEther(fund.balance)} ETH</p>
          
          {account && (
            <div>
              <input 
                type="number" 
                id={`amount-${fund.fundId}`}
                placeholder="Số ETH" 
                step="0.01"
              />
              <button 
                onClick={() => {
                  const amount = document.getElementById(`amount-${fund.fundId}`).value;
                  if (amount) {
                    handleDonate(fund.fundId, amount);
                  }
                }}
                disabled={loading}
              >
                Quyên Góp
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CharityApp;

