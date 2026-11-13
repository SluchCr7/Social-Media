'use client';
import React from 'react';
import { useAuth } from '@/app/redux/hooks';
import { useGetMemoriesQuery } from '@/app/redux/features/posts/postsApi';
import { useTranslation } from 'react-i18next';
import MemoriesDesign from './Design';

const MemoriesPage = () => {
    const { user } = useAuth();
    const { data: memories = [], isLoading } = useGetMemoriesQuery({
        viewerId: user?._id || 'anonymous',
    });
    const { t } = useTranslation();

    return (
        <MemoriesDesign
            memories={memories}
            isLoading={isLoading}
            t={t}
        />
    );
};

export default MemoriesPage;
