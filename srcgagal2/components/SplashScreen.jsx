"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 1200)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: -50,
            filter: "blur(20px)",
            backdropFilter: "blur(10px)",
          }}
          transition={{
            duration: 0.6,
            exit: {
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "tween",
            },
          }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-800 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <motion.div
              animate={{
                x: [0, 120, -80, 0],
                y: [0, -80, 100, 0],
                scale: [1, 1.4, 0.8, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 16,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -100, 80, 0],
                y: [0, 90, -60, 0],
                scale: [1, 1.5, 0.7, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 18,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 3,
              }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, 60, -40, 0],
                y: [0, -50, 70, 0],
                scale: [1, 1.2, 0.9, 1],
                rotate: [0, -90, -180, -270, -360],
              }}
              transition={{
                duration: 14,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  i % 3 === 0
                    ? "w-2 h-2 bg-white/60"
                    : i % 3 === 1
                      ? "w-1.5 h-1.5 bg-blue-200/50"
                      : "w-1 h-1 bg-purple-200/40"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-40, 40, -40],
                  x: [-30, 30, -30],
                  opacity: [0.2, 1, 0.2],
                  scale: [0.3, 1.5, 0.3],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                delay: 0.3,
              }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(59, 130, 246, 0.4), 0 0 120px rgba(147, 51, 234, 0.2)",
                      "0 0 60px rgba(255,255,255,0.7), 0 0 120px rgba(59, 130, 246, 0.6), 0 0 180px rgba(147, 51, 234, 0.4)",
                      "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(59, 130, 246, 0.4), 0 0 120px rgba(147, 51, 234, 0.2)",
                    ],
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-white/95 backdrop-blur-sm rounded-full p-6 sm:p-8 border border-white/30 shadow-2xl"
                >
                  <motion.img
                    src="/images/logo.svg"
                    alt="Penak Busiti Jane Logo"
                    className="w-full h-full object-contain"
                    animate={{
                      rotate: [0, 8, -8, 0],
                      scale: [1, 1.08, 0.98, 1],
                      y: [0, -2, 2, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-2 border-transparent border-t-white/40 border-r-blue-300/40 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-2 border border-transparent border-b-purple-300/30 border-l-white/30 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 1.2,
                type: "spring",
                stiffness: 100,
              }}
              className="mb-8"
            >
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(59, 130, 246, 0.3)",
                    "0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(59, 130, 246, 0.3)",
                  ],
                  y: [0, -1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Penak Busiti Jane
                </span>
              </motion.h1>
              <motion.p
                className="text-blue-100/80 text-base sm:text-lg lg:text-xl font-light max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  y: [0, -1, 0],
                }}
                transition={{
                  delay: 1.2,
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Pelayanan Pajak dan Retribusi Jawa Tengah Online
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="flex space-x-3 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-white to-blue-200 rounded-full"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.4, 1, 0.4],
                      y: [0, -12, 0],
                      boxShadow: [
                        "0 0 5px rgba(255,255,255,0.3)",
                        "0 0 15px rgba(255,255,255,0.8)",
                        "0 0 5px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
              <motion.p
                animate={{
                  opacity: [0.6, 1, 0.6],
                  y: [0, -1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-white/80 text-sm sm:text-base font-light tracking-wide"
              >
                Sedang memuat aplikasi...
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-6 left-6 w-16 h-16 border-2 border-white/20 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute bottom-6 right-6 w-12 h-12 border-2 border-white/15 rounded-full"
          />
          <motion.div
            animate={{
              rotate: 360,
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-6 right-6 w-8 h-8 border border-white/10 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
