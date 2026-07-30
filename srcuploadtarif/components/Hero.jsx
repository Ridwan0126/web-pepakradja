import { motion } from 'framer-motion'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  return (
    <section 
      className="w-full min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://ak-d.tripcdn.com/images/0HJ0r12000gmn1f5596C0_C_670_376_Q70.webp?proc=source%2ftrip)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10" />
      
      {/* Neon glow background elements */}
      <motion.div
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'linear-gradient(135deg, #a8d8f0, #00ffff)',
          filter: 'drop-shadow(0 0 20px rgba(168, 216, 240, 0.4))'
        }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'linear-gradient(135deg, #6eb5d9, #00eeff)',
          filter: 'drop-shadow(0 0 20px rgba(110, 181, 217, 0.4))'
        }}
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="max-w-6xl mx-auto text-center relative z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title with neon glow */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 tracking-tight drop-shadow-lg"
          style={{
            textShadow: '0 0 30px rgba(168, 216, 240, 0.5), 0 0 60px rgba(110, 181, 217, 0.3)'
          }}
        >
          Experience Innovation
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md"
        >
          Say hello to the latest generation of innovation.
        </motion.p>

        {/* CTA Buttons with neon effects */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(168, 216, 240, 0.6), 0 0 60px rgba(110, 181, 217, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Learn more</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(168, 216, 240, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
