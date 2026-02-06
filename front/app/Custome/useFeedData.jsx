
import { useMemo } from 'react';
export const useFeedLogic = (activeTab, posts, suggestedUsers, communities, userData) => {
    const following = Array.isArray(userData?.following) ? userData.following : [];
    const userId = userData?._id;

    // 🎯 1. فلترة وترتيب المنشورات (Post Sorting & Filtering)
    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];

        // 🟢 Following feed
        if (activeTab === 'following') {
            // منطق يفضل المنشورات من المتابَعين (نفس المنطق الحالي)
            return posts.slice().sort((a, b) => {
                const isAFollowed = following?.includes(a?.owner?._id);
                const isBFollowed = following?.includes(b?.owner?._id);
                if (isAFollowed && !isBFollowed) return -1;
                if (!isAFollowed && isBFollowed) return 1;
                return new Date(b?.createdAt) - new Date(a?.createdAt);
            });
        }

        // 🟣 For You feed
        if (activeTab === 'foryou') {
            if (!userData?.interests || userData.interests.length === 0) {
                // العودة إلى ترتيب زمني عادي إذا لم تتوفر اهتمامات
                return posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            const matched = posts
                .map(post => {
                    const text = (
                        `${post?.text || ''} ${post?.Hashtags?.join(' ') || ''} ${post?.owner?.description || ''}`
                    ).toLowerCase();

                    let score = 0;
                    userData.interests.forEach(interest => {
                        if (text.includes(interest.toLowerCase())) score += 1;
                    });

                    return { post, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => {
                    if (a.score !== b.score) return b.score - a.score;
                    return new Date(b.post.createdAt) - new Date(a.post.createdAt);
                })
                .map(item => item.post);

            // في حالة عدم التطابق، العودة إلى الترتيب الزمني
            return matched.length > 0
                ? matched
                : posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // 🟡 Default feed (غالباً لا نحتاجها، لكنها تبقى كخيار)
        return posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [posts, following, activeTab, userData?.interests]);

    // 🔹 2. فلترة المستخدمين والمجتمعات المقترحة
    const filteredUsers = useMemo(() => {
        if (!Array.isArray(suggestedUsers)) return [];
        // التأكد من أن المستخدمين المقترحين ليسوا من المتابَعين حالياً
        const followingIds = new Set(following.map(f => f?._id || f));
        return suggestedUsers.filter(u => u?._id && !followingIds.has(u._id));
    }, [suggestedUsers, following]);

    const filteredCommunities = useMemo(() => {
        if (!Array.isArray(communities)) return [];
        // التأكد من أن المجتمعات المقترحة لم يتم الانضمام إليها
        return communities.filter(
            c => !c.members?.some(member => member?._id === userId)
        );
    }, [communities, userId]);

    // 📦 3. دمج المنشورات مع الاقتراحات بشكل ديناميكي
    const combinedItems = useMemo(() => {
        if (!Array.isArray(filteredPosts)) return [];

        const items = [];
        // حساب الفترة الزمنية لإظهار الاقتراح (مقترح كل 6 منشورات)
        const suggestionsInterval = 6; 
        let userSuggestionIndex = 0;
        let communitySuggestionIndex = 0;

        filteredPosts.forEach((post, index) => {
            if (post) items.push({ type: 'post', data: post });

            // اقتراح مستخدمين كل فترة
            if ((index + 1) % suggestionsInterval === 0 && filteredUsers.length > userSuggestionIndex * 3) {
                const start = userSuggestionIndex * 3;
                items.push({ 
                    type: 'user', 
                    data: filteredUsers.slice(start, start + 3) 
                });
                userSuggestionIndex++;
            }

            // اقتراح مجتمعات كل ضعف الفترة
            if ((index + 1) % (suggestionsInterval * 2) === 0 && filteredCommunities.length > communitySuggestionIndex * 3) {
                const start = communitySuggestionIndex * 3;
                items.push({ 
                    type: 'community', 
                    data: filteredCommunities.slice(start, start + 3) 
                });
                communitySuggestionIndex++;
            }
        });

        return items;
    }, [filteredPosts, filteredUsers, filteredCommunities]);

    return combinedItems;
};