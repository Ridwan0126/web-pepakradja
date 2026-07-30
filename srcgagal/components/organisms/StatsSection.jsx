"use client"
import Container from "../atoms/Container"
import StatCard from "../molecules/StatCard"

export default function StatsSection({ stats = [] }) {
  // Handle undefined or empty stats
  if (!stats || stats.length === 0) {
    return null
  }

  return (
    <div className="relative py-16 batik-clouds">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 content-layer">
          {stats.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>
      </Container>
    </div>
  )
}
