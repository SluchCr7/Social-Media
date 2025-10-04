'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoClose, IoImage } from "react-icons/io5"
import Image from "next/image"
import { useMusic } from "../Context/MusicContext"

const genres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Other"]

const AddMusicModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [genre, setGenre] = useState("Other")
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { uploadMusic } = useMusic()

  // ✅ معالجة اختيار الكوفر
  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // ✅ معالجة اختيار ملف الصوت
  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    if (file) setAudioFile(file)
  }

  // ✅ إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !artist || !audioFile) {
      alert("Title, Artist, and Audio File are required!")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("artist", artist)
    formData.append("album", album)
    formData.append("genre", genre)
    formData.append("audio", audioFile)
    if (imageFile) formData.append("image", imageFile)

    await uploadMusic(formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-lightMode-bg dark:bg-darkMode-menu 
                       rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/20 
                       my-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            >
              <IoClose size={26} />
            </button>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-lightMode-text dark:text-darkMode-text">
              🎵 Add New Music
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Cover Image Upload */}
              <div className="flex flex-col items-center text-center">
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2 mb-2">
                  Cover Image
                </label>

                <div className="relative group w-40 h-40 rounded-2xl overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 bg-lightMode-menu dark:bg-darkMode-bg flex items-center justify-center cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="cover preview"
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="px-3 py-1.5 bg-white/90 dark:bg-darkMode-menu text-sm rounded-lg font-medium cursor-pointer hover:bg-white dark:hover:bg-darkMode-bg transition">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                      <div className="p-3 bg-gray-100 dark:bg-darkMode-menu rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <IoImage size={26} />
                      </div>
                      <span className="text-sm font-medium">Upload Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

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
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 
                             focus:ring-blue-500 bg-lightMode-menu dark:bg-darkMode-bg 
                             text-lightMode-fg dark:text-darkMode-fg outline-none transition"
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
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 
                             focus:ring-blue-500 bg-lightMode-menu dark:bg-darkMode-bg 
                             text-lightMode-fg dark:text-darkMode-fg outline-none transition"
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
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 
                             focus:ring-blue-500 bg-lightMode-menu dark:bg-darkMode-bg 
                             text-lightMode-fg dark:text-darkMode-fg outline-none transition"
                />
              </div>

              {/* Genre */}
              <div>
                <span className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2 mb-2">
                  Genre
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {genres.map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm font-medium transition-all
                        ${genre === g
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:border-blue-400"}`}
                    >
                      <input
                        type="radio"
                        value={g}
                        checked={genre === g}
                        onChange={() => setGenre(g)}
                        className="hidden"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-lightMode-text2 dark:text-darkMode-text2">
                  Upload Music File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="w-full mt-1 px-4 py-2 border rounded-xl cursor-pointer 
                             bg-lightMode-menu dark:bg-darkMode-bg text-lightMode-fg 
                             dark:text-darkMode-fg outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white font-semibold hover:opacity-90 transition-all shadow-md"
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
