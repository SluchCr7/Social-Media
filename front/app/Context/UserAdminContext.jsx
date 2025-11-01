// 'use client';
// import { createContext, useContext, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useAlert } from './AlertContext';

// const UserAdminContext = createContext();
// export const useAdmin = () => useContext(UserAdminContext);

// export const UserAdminContextProvider = ({ children }) => {
//   const { user, setUser, setUsers } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const {showAlert} = useAlert()
//   // 🧩 1️⃣ Make User Admin
//   const makeUserAdmin = async (userId) => {
//     if (!user?.token) return showAlert('You must be logged in as an admin');
//     try {
//       setLoading(true);
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/admin/${userId}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setUsers((prev) =>
//         prev.map((u) =>
//           u._id === userId ? { ...u, isAdmin: true } : u
//         )
//       );
//       showAlert(res.data.message || 'User is now an Admin');
//     } catch (err) {
//       console.error(err);
//       showAlert(err.response?.data?.message || 'Failed to make user Admin');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧩 2️⃣ Block / Unblock User
//   const blockOrUnblockUser = async (id) => {
//     if (!user?.token) return showAlert('Login required');
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setUser((prevUser) => {
//         const isBlocked = prevUser.blockedUsers.includes(id);
//         const updatedUser = {
//           ...prevUser,
//           blockedUsers: isBlocked
//             ? prevUser.blockedUsers.filter((b) => b !== id)
//             : [...prevUser.blockedUsers, id],
//         };
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//         return updatedUser;
//       });

//       showAlert(res.data.message);
//       return res.data.updatedTargetUser;
//     } catch (err) {
//       console.error(err);
//       showAlert(err.response?.data?.message || 'Error blocking user');
//     }
//   };

//   // 🧩 3️⃣ Update Account Status (Suspend / Active / etc)
//   const makeAccountPremiumVerify = async () => {
//     if (!user?.token) return showAlert('You must be logged in');
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       // تحديث حالة الحساب المحليًا
//       setUser((prev) => ({ ...prev, isAccountWithPremiumVerify: true }));

//       showAlert(res.data.message || 'Account verified successfully');
//     } catch (err) {
//       console.error(err);
//       showAlert(err.response?.data?.message || 'Failed to verify account');
//     }
//   };


//   const updateAccountStatus = async (userId, status, days = 7) => {
//     if (!user?.token) return showAlert('You must be logged in as an admin');

//     try {
//       const body = { accountStatus: status };
//       if (status === "suspended" && days) {
//         body.days = days; // نضيف مدة التعليق لو فيه
//       }

//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/status/${userId}`,
//         body,
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       // تحديث الـ users في الـ state لو عندك لستة users
//       setUsers((prev) =>
//         prev.map((u) =>
//           u._id === userId ? { ...u, accountStatus: status } : u
//         )
//       );

//       // لو بتعدل نفسك كـ user (حالة خاصة)
//       if (user._id === userId) {
//         const updatedUser = { ...user, accountStatus: status };
//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       }

//       showAlert(res.data.message || `Account status updated to ${status}`);
//     } catch (err) {
//       console.error(err);
//       showAlert(err.response?.data?.message || 'Failed to update account status');
//     }
//   };

//   // 🧩 4️⃣ Delete User (اختياري)
//   const deleteUser = async (id) => {
//     try {
//       const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/delete/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       showAlert(res.data.message || 'User deleted successfully');
//       setUsers((prev) => prev.filter((u) => u._id !== id));
//     } catch (err) {
//       console.error(err);
//       showAlert(err.response?.data?.message || 'Failed to delete user');
//     }
//   };

//   return (
//     <UserAdminContext.Provider
//       value={{
//         makeUserAdmin,
//         blockOrUnblockUser,
//         updateAccountStatus,
//         deleteUser,
//         makeAccountPremiumVerify,
//         loading,
//       }}
//     >
//       {children}
//     </UserAdminContext.Provider>
//   );
// };
'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const UserAdminContext = createContext();
export const useAdmin = () => useContext(UserAdminContext);

export const UserAdminContextProvider = ({ children }) => {
  const { user, setUser, setUsers } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  // 🧩 1️⃣ Make User Admin
  const makeUserAdmin = useCallback(async (userId) => {
    if (!user?.token) return showAlert('You must be logged in as an admin');

    try {
      setLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: true } : u))
      );
      showAlert(res.data.message || 'User is now an Admin');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to make user Admin');
    } finally {
      setLoading(false);
    }
  }, [user, showAlert, setUsers]);

  // 🧩 2️⃣ Block / Unblock User
  const blockOrUnblockUser = useCallback(async (id) => {
    if (!user?.token) return showAlert('Login required');
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUser((prevUser) => {
        const isBlocked = prevUser.blockedUsers.includes(id);
        const updatedUser = {
          ...prevUser,
          blockedUsers: isBlocked
            ? prevUser.blockedUsers.filter((b) => b !== id)
            : [...prevUser.blockedUsers, id],
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      showAlert(res.data.message);
      return res.data.updatedTargetUser;
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Error blocking user');
    }
  }, [user, showAlert, setUser]);

  // 🧩 3️⃣ Verify Premium Account
  const makeAccountPremiumVerify = useCallback(async () => {
    if (!user?.token) return showAlert('You must be logged in');

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/verify`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUser((prev) => ({ ...prev, isAccountWithPremiumVerify: true }));
      showAlert(res.data.message || 'Account verified successfully');
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to verify account');
    }
  }, [user, showAlert, setUser]);

  // 🧩 4️⃣ Update Account Status (Suspend / Active)
  const updateAccountStatus = useCallback(async (userId, status, days = 7) => {
    if (!user?.token) return showAlert('You must be logged in as an admin');

    try {
      const body = { accountStatus: status };
      if (status === 'suspended' && days) body.days = days;

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/status/${userId}`,
        body,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, accountStatus: status } : u
        )
      );

      // لو المستخدم هو نفسه
      if (user._id === userId) {
        const updatedUser = { ...user, accountStatus: status };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      showAlert(res.data.message || `Account status updated to ${status}`);
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to update account status');
    }
  }, [user, showAlert, setUser, setUsers]);

  // 🧩 5️⃣ Delete User
  const deleteUser = useCallback(async (id) => {
    if (!user?.token) return showAlert('Login required');
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/delete/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      showAlert(res.data.message || 'User deleted successfully');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || 'Failed to delete user');
    }
  }, [user, showAlert, setUsers]);

  return (
    <UserAdminContext.Provider
      value={{
        makeUserAdmin,
        blockOrUnblockUser,
        updateAccountStatus,
        deleteUser,
        makeAccountPremiumVerify,
        loading,
      }}
    >
      {children}
    </UserAdminContext.Provider>
  );
};
