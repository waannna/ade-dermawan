import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const topRef = useRef(null)

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [pathname])

  return <div ref={topRef} className="scroll-to-top" />
}

export default ScrollToTop