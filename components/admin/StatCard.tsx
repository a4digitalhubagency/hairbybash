interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
}

export default function StatCard({ icon, label, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-dark-card rounded-xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <span className="text-gold">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
    </div>
  )
}
