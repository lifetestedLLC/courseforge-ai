import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleError, Logger } from '@/lib/errors'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user stats
    const [
      totalCourses,
      publishedCourses,
      totalStudents,
      totalRevenue
    ] = await Promise.all([
      // Total courses created by user
      db.course.count({
        where: { userId: session.user.id }
      }),
      
      // Published courses
      db.course.count({
        where: { 
          userId: session.user.id,
          status: 'published'
        }
      }),
      
      // Total students (simplified - in real app, you'd track enrollments)
      db.course.aggregate({
        where: { userId: session.user.id },
        _sum: {
          // Assuming you have an enrollment count field
          // For now, return 0
        }
      }).then(() => 0), // Placeholder
      
      // Total revenue (simplified - in real app, you'd track sales)
      Promise.resolve(0) // Placeholder
    ])

    const stats = {
      totalCourses,
      publishedCourses,
      totalStudents,
      revenue: totalRevenue
    }

    Logger.info('User stats retrieved', { 
      userId: session.user.id, 
      stats 
    })

    return NextResponse.json(stats)
    
  } catch (error) {
    Logger.error('Error fetching user stats', error)
    const errorResponse = handleError(error)
    return new NextResponse(errorResponse.message, { status: errorResponse.status })
  }
}