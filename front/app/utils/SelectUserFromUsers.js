export const selectUserFromUsers = (settter , users , id) => {
    const matchedUser = users.find(u => u?._id === id)
    settter(matchedUser || null)
}