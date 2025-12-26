import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import DashboardSkeleton from '@/components/educators/DashboardSkeleton'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Card, CardContent } from '@/components/ui/card'
import { Users, BookOpen, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {

  const { currency, isEducator, backendUrl, getToken } = useContext(AppContext)!

  const [dashboardData, setDashboardData] = useState<any>(null)

  const fetchDashboardData = async () => {
    try {

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setDashboardData(data.dashboardData)
      }
      else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
          {/* Total Enrolments */}
          <Card className='border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 bg-card'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/5 rounded-2xl ring-1 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'>
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className='text-3xl font-bold text-foreground font-outfit'>
                  {dashboardData.enrolledStudentsData.length}
                </p>
                <p className='text-sm text-medium text-muted-foreground'>Total Enrolments</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Courses */}
          <Card className='border border-green-500/10 hover:border-green-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 bg-card'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='p-3 bg-gradient-to-br from-green-500/20 to-green-600/5 rounded-2xl ring-1 ring-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'>
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className='text-3xl font-bold text-foreground font-outfit'>
                  {dashboardData.totalCourses}
                </p>
                <p className='text-sm text-medium text-muted-foreground'>Total Courses</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card className='border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 bg-card'>
            <CardContent className='p-6 flex items-center gap-4'>
              <div className='p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/5 rounded-2xl ring-1 ring-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'>
                <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className='text-3xl font-bold text-foreground font-outfit'>
                  {currency}{dashboardData.totalearnings}
                </p>
                <p className='text-sm text-medium text-muted-foreground'>Total Earnings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Chart */}
          <div className='bg-card border border-border/50 rounded-2xl shadow-sm p-6 h-[420px]'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-foreground font-outfit'>Earnings Overview</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Revenue
              </div>
            </div>
            <div className='h-[320px] w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.chartData || []} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${currency}${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Enrolments */}
          <div className='w-full'>
            <h2 className='pb-4 text-xl font-bold text-foreground font-outfit'>Latest Enrolments</h2>
            <div className='rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm h-[420px]'>
              <div className='overflow-auto h-full scrollbar-thin scrollbar-thumb-muted w-full'>
                <table className='w-full text-sm text-left relative min-w-[600px]'>
                  <thead className='text-muted-foreground uppercase bg-muted/50 text-xs font-semibold sticky top-0 backdrop-blur-sm z-10'>
                    <tr>
                      <th className='px-6 py-4 hidden sm:table-cell'>#</th>
                      <th className='px-6 py-4'>Student Name</th>
                      <th className='px-6 py-4'>Course Title</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-border/50'>
                    {
                      dashboardData.enrolledStudentsData.map((item: any, index: number) => (
                        <tr key={index} className='hover:bg-muted/30 transition-colors group'>
                          <td className='px-6 py-4 hidden sm:table-cell text-muted-foreground font-mono'>
                            {index + 1}
                          </td>
                          <td className='px-6 py-4 flex items-center gap-3'>
                            <div className="relative">
                              <img src={item.student.imageUrl} alt="" className='w-10 h-10 rounded-full object-cover border border-border group-hover:border-primary/50 transition-colors' />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
                            </div>
                            <span className='truncate font-semibold text-foreground group-hover:text-primary transition-colors'>{item.student.name}</span>
                          </td>
                          <td className='px-6 py-4 text-muted-foreground group-hover:text-foreground transition-colors'>
                            {item.courseTitle}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  ) : <DashboardSkeleton />
}

export default Dashboard
