export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
        <p className="mt-6 text-gray-600 font-medium">Processing your order...</p>
        <p className="text-gray-500 text-sm mt-2">This will only take a moment</p>
      </div>
    </div>
  )
}
