'use client'

export const checkUserStatus = (action = "perform this action",showAlert, user) => {
    if (!user || !user.token) {
      showAlert(`You must be logged in to ${action}.`);
      return false;
    }
    if (user?.accountStatus === "banned" || user?.accountStatus === "suspended") {
      showAlert(`Your account is suspended. You cannot ${action}.`);
      return false;
    }
    return true;
};