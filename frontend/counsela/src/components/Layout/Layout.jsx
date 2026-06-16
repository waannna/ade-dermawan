import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import Header from './Header'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../../hooks/useAuth'

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const topRef = useRef(null)

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [location.pathname])

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: '80px',
          },
        }}
      />
      
      <Header />
      
      <main className="w-full min-h-screen pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Layout