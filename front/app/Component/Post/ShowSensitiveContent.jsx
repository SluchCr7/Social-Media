import React from 'react'
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import {IoIosWarning} from 'react-icons/io'
const ShowSensitiveContent = ({
    setShowSensitive,
    t
}) => {
  return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="
              absolute inset-0 z-[60] 
              flex items-center justify-center 
              rounded-2xl overflow-hidden
              px-6 py-10 sm:px-10 sm:py-14
            "
          >
            {/* 🔲 خلفية ضبابية متدرجة بألوان متناسقة في Light و Dark */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-b 
                from-white/80 via-white/60 to-white/80
                dark:from-black/70 dark:via-black/60 dark:to-black/80
                backdrop-blur-[25px]
                border border-white/40 dark:border-gray-800/70
                rounded-2xl
                shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]
              "
            />

            {/* ⚠️ صندوق التحذير */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="
                relative z-10 flex flex-col items-center justify-center 
                gap-6 px-8 py-10 sm:px-10 sm:py-12 
                rounded-2xl
                max-w-md text-center
              "
            >
              {/* أيقونة التحذير (متحركة بلطف) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/40 shadow-lg"
              >
                <span className="text-4xl"><IoIosWarning/></span>
              </motion.div>

              {/* العنوان */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-wide drop-shadow-md">
                {t('Sensitive Content')}
              </h2>

              {/* نص توضيحي اختياري (يمكنك حذفه إن لم ترغب) */}
              {/* <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xs">
                {t('This post may contain inappropriate or sensitive language.')}
              </p> */}

              {/* زر العرض */}
              <button
                onClick={() => setShowSensitive(false)}
                className="
                  px-10 py-2 sm:px-12 sm:py-3 
                  rounded-full font-semibold 
                  text-gray-900 dark:text-black 
                  bg-gradient-to-r from-white via-gray-50 to-white 
                  dark:from-gray-100 dark:to-gray-200
                  hover:from-gray-100 hover:to-white
                  transition-all duration-300 ease-in-out
                  shadow-[0_4px_25px_-5px_rgba(255,255,255,0.4)]
                "
              >
                {t('View Anyway')}
              </button>
            </motion.div>
      </motion.div>
  )
}

export default ShowSensitiveContent