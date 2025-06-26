"use client"

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data for charts
const reservationData = [
  { name: "Ocak", reservations: 65, revenue: 12000 },
  { name: "Şubat", reservations: 78, revenue: 15600 },
  { name: "Mart", reservations: 90, revenue: 18000 },
  { name: "Nisan", reservations: 81, revenue: 16200 },
  { name: "Mayıs", reservations: 95, revenue: 19000 },
  { name: "Haziran", reservations: 110, revenue: 22000 },
]

const categoryData = [
  { name: "Restoran", value: 45, color: "#3B82F6" },
  { name: "Kuaför", value: 25, color: "#10B981" },
  { name: "Spor Salonu", value: 15, color: "#F59E0B" },
  { name: "Kafe", value: 10, color: "#EF4444" },
  { name: "Diğer", value: 5, color: "#8B5CF6" },
]

const dailyReservations = [
  { day: "Pzt", count: 12 },
  { day: "Sal", count: 19 },
  { day: "Çar", count: 15 },
  { day: "Per", count: 22 },
  { day: "Cum", count: 28 },
  { day: "Cmt", count: 35 },
  { day: "Paz", count: 18 },
]

interface ReservationTrendChartProps {
  className?: string
}

export function ReservationTrendChart({ className }: ReservationTrendChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reservationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="reservations" stroke="#3B82F6" strokeWidth={2} name="Rezervasyon Sayısı" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RevenueChartProps {
  className?: string
}

export function RevenueChart({ className }: RevenueChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reservationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`₺${value}`, "Gelir"]} />
          <Legend />
          <Bar dataKey="revenue" fill="#10B981" name="Aylık Gelir" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CategoryDistributionChartProps {
  className?: string
}

export function CategoryDistributionChart({ className }: CategoryDistributionChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface DailyReservationsChartProps {
  className?: string
}

export function DailyReservationsChart({ className }: DailyReservationsChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dailyReservations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#F59E0B" name="Rezervasyon" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Rezervasyon Trendi</h3>
        <ReservationTrendChart />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Aylık Gelir</h3>
        <RevenueChart />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Kategori Dağılımı</h3>
        <CategoryDistributionChart />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Haftalık Rezervasyonlar</h3>
        <DailyReservationsChart />
      </div>
    </div>
  )
}
