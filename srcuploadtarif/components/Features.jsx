import { motion } from 'framer-motion'
import { Zap, Shield, Smartphone, Watch, Headphones, Camera } from 'lucide-react'

const Features = () => {
  const features = [
    {
      id: 1,
      title: 'Lightning Fast',
      description: 'Experience speeds that feel like magic with our advanced chip technology',
      icon: Zap,
      gradient: 'from-blue-400 to-blue-500'
    },
    {
      id: 2,
      title: 'Maximum Security',
      description: 'Your privacy is our priority with enterprise-grade encryption',
      icon: Shield,
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      id: 3,
      title: 'All Devices',
      description: 'Seamlessly work across all your devices with perfect synchronization',
      icon: Smartphone,
      gradient: 'from-blue-300 to-blue-400'
    },
    {
      id: 4,
      title: 'Wearable Ready',
      description: 'Connect with your smartwatch for complete control on the go',
      icon: Watch,
      gradient: 'from-slate-600 to-slate-700'
    },
    {
      id: 5,
      title: 'Premium Audio',
      description: 'Immersive sound quality with spatial audio technology',
      icon: Headphones,
      gradient: 'from-blue-350 to-blue-450'
    },
    {
      id: 6,
      title: 'Stunning Camera',
      description: 'Capture professional-quality photos and videos every time',
      icon: Camera,
      gradient: 'from-slate-400 to-slate-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to stay productive and connected
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="glassmorphism rounded-2xl p-8 shadow-lg hover-lift"
              >
                {/* Icon Container */}
                <motion.div
                  className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon size={32} className="text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <motion.a
                  href="#"
                  className="inline-block mt-6 text-primary font-semibold hover:text-blue-700 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn more →
                </motion.a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
