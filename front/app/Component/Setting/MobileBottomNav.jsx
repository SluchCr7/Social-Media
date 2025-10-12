import { TABS } from '@/app/utils/Data'
import React from 'react'

const MobileBottomNav = ({setActiveTab,activeTab}) => (
<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl md:hidden">
    <div className="backdrop-blur bg-white/60 dark:bg-gray-900/60 border rounded-2xl p-2 flex justify-between">
    {TABS.slice(0, 4).map((t) => (
        <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={clsx('flex-1 text-center p-2 rounded-lg', activeTab === t.id ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200')}
            >
            <div className="text-lg mx-auto">{t.icon}</div>
            <div className="text-xs mt-1">{t.label.split(' ')[0]}</div>
        </button>
    ))}
    </div>
</div>
)

export default MobileBottomNav