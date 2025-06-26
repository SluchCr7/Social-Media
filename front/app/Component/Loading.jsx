import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
    </div>
  )
}

export default Loading