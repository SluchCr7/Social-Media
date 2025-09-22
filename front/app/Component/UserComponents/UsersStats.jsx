export const CheckStateAccount = (user) => {
  if (user?.accountStatus === 'banned') {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-red-600">This account has been banned</h1>
          <p className="text-gray-500 mt-2">
            account is permanently disabled due to policy violations.
          </p>
        </div>
      </div>
    )
  }

  if (user?.accountStatus === 'suspended') {
    const until = user?.suspendedUntil
      ? new Date(user.suspendedUntil).toLocaleDateString()
      : 'a future date'

    return (
      <div className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-yellow-500">This account is suspended</h1>
          <p className="text-gray-500 mt-2">
            You cannot View This Page{' '}
            <span className="font-semibold">{until}</span>.
          </p>
        </div>
      </div>
    )
  }
}