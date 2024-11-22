import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-blue-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="mt-4 text-lg font-semibold text-blue-600"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}

