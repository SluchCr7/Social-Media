import React from 'react'
import { FaPlus, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'
import CommunityCard from '@/app/Component/Community/CommunityCard'
import CreateCommunityModal from '@/app/Component/Community/CreateCommunityModal'
import CommunityFilter from '@/app/Component/Community/CommunityFilter'


const MaidDesign = ({
  categories = [],            
  activeCategory,             
  setActiveCategory,           
  searchTerm,                 
  setSearchTerm,              
  sortBy,                     
  setSortBy,                  
  filtered = [],               
  visibleCount = 6,            
  setShowCreateModal,         
  showCreateModal,            
  form,                        
  setForm,                     
  handleCreate,                
  isCreating                   
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white p-6 md:p-8 overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
              🌐 Community Hub
            </h1>
            <p className="text-sm md:text-base opacity-95 max-w-full">
              Discover, create, and join active groups around your interests.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-lightMode-fg dark:bg-darkMode-fg text-lightMode-bg dark:text-darkMode-bg px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
              >
                <FaPlus /> Create Community
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="w-48 h-48 rounded-xl bg-lightMode-menu dark:bg-darkMode-menu p-4 flex items-center justify-center overflow-hidden text-white text-6xl font-bold">
              <FaUsers className="text-sky-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <CommunityFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* COMMUNITY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, visibleCount).length === 0 ? (
          <div className="col-span-full p-8 bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-lightMode-bg dark:bg-darkMode-bg rounded-lg flex items-center justify-center text-4xl">
              📭
            </div>
            <h3 className="text-lg font-semibold">No communities found</h3>
            <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2">
              Try a different filter or create a new community.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg"
            >
              Create community
            </button>
          </div>
        ) : (
          filtered.slice(0, visibleCount).map((comm) => (
            <CommunityCard key={comm._id} comm={comm} />
          ))
        )}
      </section>

      {/* CREATE MODAL */}
      <CreateCommunityModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        form={form}
        setForm={setForm}
        handleCreate={handleCreate}
        isCreating={isCreating}
      />
    </div>
  )
}

export default MaidDesign
