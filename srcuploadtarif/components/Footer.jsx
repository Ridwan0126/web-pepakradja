import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: ['Mac', 'iPhone', 'iPad', 'Watch', 'AirPods']
    },
    {
      title: 'Support',
      links: ['Documentation', 'API Reference', 'Community', 'Contact Us']
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog']
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies', 'Security']
    }
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' }
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
      transition: { duration: 0.6 }
    }
  }

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.h3
              className="text-2xl font-bold text-gradient mb-4"
              whileHover={{ scale: 1.05 }}
            >
              ◆
            </motion.h3>
            <p className="text-gray-400 mb-6">
              Innovating the future of technology
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, color: '#0066FF' }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants}>
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-800 my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        />

        {/* Bottom Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
              <Mail size={18} />
              <a href="mailto:hello@example.com">hello@example.com</a>
            </div>
            <div className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
              <Phone size={18} />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <MapPin size={18} />
              <span>San Francisco, CA</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                FAQ
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Status
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">Subscribe for latest updates</p>
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-full text-gray-900 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 Modern Apple Style. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
