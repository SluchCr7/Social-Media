// ملف: Explore/ExploreTabs.jsx

import React from 'react';

const ExploreTabs = ({ allTabs, activeTab, setActiveTab }) => {
    return (
        <div className="max-w-3xl mx-auto flex justify-center flex-wrap gap-3 mb-6 relative">
            {allTabs?.map((tab) => (
                <button
                    key={tab?.name}
                    onClick={() => setActiveTab(tab?.name)}
                    className={`px-4 py-2 rounded-full font-semibold transition
                        ${activeTab === tab?.name
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 hover:opacity-80'}`}
                >
                    {tab?.name}
                </button>
            ))}
        </div>
    );
}

export default ExploreTabs;