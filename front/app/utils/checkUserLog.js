
export const checkUserStatus = (action = "perform this action", showAlert, user) => {
    if (!user || !user._id) {
      if (typeof showAlert === 'function') {
        showAlert(`You must be logged in to ${action}.`);
      }
      return false;
    }
    if (user?.accountStatus === "banned" || user?.accountStatus === "suspended") {
      if (typeof showAlert === 'function') {
        showAlert(`Your account is suspended. You cannot ${action}.`);
      }
      return false;
    }
    return true;
};