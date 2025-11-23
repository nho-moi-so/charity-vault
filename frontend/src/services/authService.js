import { authAPI } from "./api";
import {
  connectWallet as connectWalletProvider,
  getCurrentAddress,
} from "./Web3Service";

const USER_STORAGE_KEY = "user";
const WALLET_STORAGE_KEY = "walletAddress";

export const getStoredUser = () => {
  const userRaw = localStorage.getItem(USER_STORAGE_KEY);
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
};

const EXPLICIT_LOGOUT_KEY = "isExplicitLogout";

export const notifyAuthChange = (user) => {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: user }));
};

const storeUserSession = (user, address) => {
  if (user) {
    const stored = { ...user };
    if (!stored.address && address) {
      stored.address = address;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(stored));
  }
  if (address) {
    localStorage.setItem(WALLET_STORAGE_KEY, address);
  }
  // Khi đăng nhập thành công, xóa cờ đã đăng xuất
  localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
  notifyAuthChange(user);
};

export const logout = () => {
  authAPI.logout();
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(WALLET_STORAGE_KEY);
  // Đánh dấu là người dùng đã chủ động đăng xuất
  localStorage.setItem(EXPLICIT_LOGOUT_KEY, "true");
  notifyAuthChange(null);
};

export const loginWithAddress = async (address) => {
  if (!address) {
    throw new Error("Không tìm thấy địa chỉ ví.");
  }

  const response = await authAPI.connectWallet({ address });
  if (!response.data?.success) {
    throw new Error(response.data?.error || "Không thể kết nối ví.");
  }

  const user = response.data.user || { address };
  storeUserSession(user, address);
  return user;
};

export const loginWithWallet = async () => {
  const address = await connectWalletProvider();
  return await loginWithAddress(address);
};

export const ensureWalletLogin = async () => {
  try {
    // Nếu người dùng đã chủ động đăng xuất, không tự động đăng nhập lại
    if (localStorage.getItem(EXPLICIT_LOGOUT_KEY)) {
      return null;
    }

    const address = await getCurrentAddress();
    if (!address) {
      return null;
    }

    const storedUser = getStoredUser();
    if (
      storedUser &&
      storedUser.address?.toLowerCase() === address.toLowerCase()
    ) {
      return storedUser;
    }

    return await loginWithAddress(address);
  } catch (error) {
    console.error("ensureWalletLogin error:", error);
    return null;
  }
};

export const fetchUserProfile = async (address) => {
  if (!address) throw new Error("Thiếu địa chỉ ví.");
  const response = await authAPI.getUser(address);
  if (!response.data?.success) {
    throw new Error(
      response.data?.error || "Không thể lấy thông tin người dùng."
    );
  }
  const user = response.data.user;
  storeUserSession(user, user.address);
  return user;
};

export const updateUserProfile = async (payload) => {
  if (!payload?.address) {
    throw new Error("Thiếu địa chỉ ví.");
  }

  const response = await authAPI.updateProfile(payload);
  if (!response.data?.success) {
    throw new Error(response.data?.error || "Không thể cập nhật hồ sơ.");
  }

  const user = response.data.user;
  storeUserSession(user, user.address);
  return user;
};
