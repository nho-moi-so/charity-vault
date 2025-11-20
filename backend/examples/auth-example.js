// ============================================
// VÍ DỤ: Web3 Authentication (Kết nối ví)
// ============================================

import { ethers } from 'ethers';

// ============================================
// 1. KẾT NỐI VÍ VÀ XÁC THỰC
// ============================================

async function connectWalletAndAuth() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask!');
  }

  try {
    // Bước 1: Yêu cầu kết nối ví
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    const address = accounts[0];

    // Bước 2: Tạo message để ký (optional - để verify ownership)
    const message = `Please sign this message to authenticate.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
    
    // Bước 3: Yêu cầu user ký message
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);

    // Bước 4: Gửi lên backend để verify và lưu user
    const response = await fetch('http://localhost:3001/api/auth/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        signature,
        message
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Authenticated:', data.user);
      // Lưu user info vào localStorage hoặc state
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('address', address);
      return data.user;
    } else {
      throw new Error(data.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// ============================================
// 2. CẬP NHẬT PROFILE
// ============================================

async function updateProfile(username, email, avatar, bio) {
  const address = localStorage.getItem('address');
  
  if (!address) {
    throw new Error('Please connect wallet first');
  }

  try {
    const response = await fetch('http://localhost:3001/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        username,
        email,
        avatar,
        bio
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Profile updated:', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } else {
      throw new Error(data.error || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// ============================================
// 3. LẤY THÔNG TIN USER
// ============================================

async function getUser(address) {
  try {
    const response = await fetch(`http://localhost:3001/api/auth/${address}`);
    const data = await response.json();
    
    if (data.success) {
      return data.user;
    } else {
      throw new Error(data.error || 'User not found');
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// ============================================
// 4. KIỂM TRA ĐÃ ĐĂNG NHẬP
// ============================================

function isAuthenticated() {
  const user = localStorage.getItem('user');
  const address = localStorage.getItem('address');
  return !!(user && address);
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ============================================
// 5. ĐĂNG XUẤT
// ============================================

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('address');
  console.log('✅ Logged out');
}

// ============================================
// VÍ DỤ SỬ DỤNG
// ============================================

/*
// Trong React component:
const [user, setUser] = useState(null);

useEffect(() => {
  const savedUser = getCurrentUser();
  if (savedUser) {
    setUser(savedUser);
  }
}, []);

const handleConnect = async () => {
  try {
    const user = await connectWalletAndAuth();
    setUser(user);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

const handleUpdateProfile = async () => {
  try {
    const updated = await updateProfile(
      'John Doe',
      'john@example.com',
      'https://avatar.url',
      'I love helping others!'
    );
    setUser(updated);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
*/

export { 
  connectWalletAndAuth, 
  updateProfile, 
  getUser, 
  isAuthenticated, 
  getCurrentUser, 
  logout 
};

