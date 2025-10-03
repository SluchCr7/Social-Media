'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoClose } from "react-icons/io5"

const genres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Other"]

const AddMusicModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [genre, setGenre] = useState("Other")
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !artist || !file) {
      alert("Title, Artist and File are required!")
      return
    }
    const newMusic = { title, artist, album, genre, url: file }
    onSubmit(newMusic)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg bg-lightMode-bg dark:bg-darkMode-menu 
                       rounded-2xl shadow-2xl p-6 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-lightMode-text dark:text-darkMode-text 
                         hover:scale-110 transition"
            >
              <IoClose size={26} />
            </button>

            <h2 className="text-xl md:text-2xl font-bold mb-6 text-lightMode-text dark:text-darkMode-text">
              🎵 Add New Music
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter song title"
                  className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 
                             focus:ring-lightMode-text dark:focus:ring-darkMode-text 
                             bg-lightMode-menu dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2">
                  Artist
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 
                             focus:ring-lightMode-text dark:focus:ring-darkMode-text 
                             bg-lightMode-menu dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg"
                />
              </div>

              {/* Album */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2">
                  Album (Optional)
                </label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="Enter album name"
                  className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 
                             focus:ring-lightMode-text dark:focus:ring-darkMode-text 
                             bg-lightMode-menu dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg"
                />
              </div>

              {/* Genre */}
              <div>
                <span className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2 mb-2">
                  Genre
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((g) => (
                    <label
                      key={g}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer
                                ${genre === g
                          ? "border-lightMode-text dark:border-darkMode-text bg-lightMode-menu dark:bg-darkMode-bg"
                          : "border-gray-300 dark:border-gray-700"}`}
                    >
                      <input
                        type="radio"
                        value={g}
                        checked={genre === g}
                        onChange={() => setGenre(g)}
                        className="hidden"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2">
                  Upload Music File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full mt-1 px-3 py-2 border rounded-xl cursor-pointer bg-lightMode-menu dark:bg-darkMode-bg"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 mt-4 rounded-xl bg-lightMode-text dark:bg-darkMode-text 
                           text-white font-medium hover:opacity-90 transition"
              >
                Save Music
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddMusicModal
