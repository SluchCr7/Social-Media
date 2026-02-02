'use client';
import React, { useEffect } from 'react';
import { usePost } from '@/app/Context/PostContext';
import { useTranslation } from 'react-i18next';
import MemoriesDesign from './Design';
import Loading from '@/app/Component/Loading';

const MemoriesPage = () => {
    const { memories, memoriesLoading, fetchMemories } = usePost();
    const { t } = useTranslation();

    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    return (
        <MemoriesDesign
            memories={memories}
            isLoading={memoriesLoading}
            t={t}
        />
    );
};

export default MemoriesPage;
