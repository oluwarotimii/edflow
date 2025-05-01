import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SchoolStats() {
  // Mock data - replace with actual data fetching logic
  const stats = [
    { title: 'Total Students', value: 0 },
    { title: 'Total Teachers', value: 0 },
    { title: 'Average Attendance', value: '0%' },
    { title: 'Upcoming Events', value: 0 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

