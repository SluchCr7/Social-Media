const handleProfileClick = async (userSelected , getUserStories ,setUserStories,setIsViewerOpen) => {
    if (!userSelected?._id) return
    const fetchedStories = await getUserStories(userSelected._id)
    if (fetchedStories.length > 0) {
        setUserStories(fetchedStories)
        setIsViewerOpen(true)
    }
}