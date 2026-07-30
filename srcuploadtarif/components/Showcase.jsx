import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Showcase = () => {
  const products = [
    {
      title: 'iPad Air',
      subtitle: 'Impossibly thin and powerful.',
      image: '/images/ipad-air.jpg',
      layout: 'col-span-1 md:col-span-2 row-span-2'
    },
    {
      title: 'MacBook Pro 14"',
      subtitle: 'Supercharged by M4.',
      image: '/images/macbook-pro.jpg',
      layout: 'col-span-1 md:col-span-2 row-span-1'
    },
    {
      title: 'Apple Watch',
      subtitle: 'Advanced health insights.',
      image: '/images/apple-watch.jpg',
      layout: 'col-span-1 row-span-1'
    },
    {
      title: 'AirPods Pro',
      subtitle: 'Premium audio experience.',
      image: '/images/airpods.jpg',
      layout: 'col-span-1 row-span-1'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section Title */}
        <motion.div className="mb-12 text-center" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Collection
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the perfect blend of innovation and design
          </p>
        </motion.div>

        {/* Products Grid - Masonry Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px] md:auto-rows-[280px]"
          variants={containerVariants}
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`${product.layout} rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${product.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
                <div />

                {/* Bottom Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-100 mb-4">
                    {product.subtitle}
                  </p>
                  <motion.button
                    whileHover={{ gap: '8px' }}
                    className="flex items-center gap-2 text-white text-xs md:text-sm font-medium hover:text-blue-300 transition-colors"
                  >
                    Learn more
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Showcase
