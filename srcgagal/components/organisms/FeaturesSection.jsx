"use client"

import { motion } from "framer-motion"
import Container from "../atoms/Container"
import Heading from "../atoms/Heading"
import FeatureCard from "../molecules/FeatureCard"

export default function FeaturesSection({ features = [] }) {
  // Handle undefined or empty features
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="relative py-16 batik-clouds">
      <Container>
        <div className="content-layer">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Heading level={2}>Fitur Unggulan</Heading>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nikmati kemudahan akses informasi pajak dan retribusi dengan fitur-fitur terdepan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                index={index}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
