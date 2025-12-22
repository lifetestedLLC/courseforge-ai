import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Get current month start and end dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    
    // Count courses created this month
    const coursesThisMonth = await db.course.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })
    
    // Count total courses
    const totalCourses = await db.course.count({
      where: {
        userId: session.user.id
      }
    })
    
    // Calculate video minutes (placeholder - you'll need to implement actual video tracking)
    const videoMinutesUsed = await calculateVideoMinutes(session.user.id)
    
    // Calculate storage used (placeholder - you'll need to implement actual storage tracking)
    const storageUsedGB = await calculateStorageUsage(session.user.id)
    
    return NextResponse.json({
      coursesThisMonth,
      totalCourses,
      videoMinutesUsed,
      storageUsedGB
    })
    
  } catch (error) {
    console.error('Error fetching usage data:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

async function calculateVideoMinutes(userId: string): Promise<number> {
  // This is a placeholder implementation
  // In a real app, you would:
  // 1. Query all video lessons for this user
  // 2. Sum up their durations
  // 3. Track actual video upload/processing time
  
  try {
    const videoLessons = await db.lesson.findMany({
      where: {
        module: {
          course: {
            userId: userId
          }
        },
        type: 'video'
      },
      select: {
        duration: true
      }
    })
    
    // Sum up durations (assuming duration is in minutes)
    const totalMinutes = videoLessons.reduce((sum, lesson) => {
      return sum + (lesson.duration || 0)
    }, 0)
    
    return totalMinutes
  } catch (error) {
    console.error('Error calculating video minutes:', error)
    return 0
  }
}

async function calculateStorageUsage(userId: string): Promise<number> {
  // This is a placeholder implementation
  // In a real app, you would:
  // 1. Query all file uploads (videos, images, documents)
  // 2. Sum up their file sizes
  // 3. Track database storage usage
  
  try {
    // For now, estimate based on content length and number of courses
    const courses = await db.course.findMany({
      where: {
        userId: userId
      },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    })
    
    let estimatedStorageMB = 0
    
    for (const course of courses) {
      // Estimate ~1MB per course for metadata
      estimatedStorageMB += 1
      
      for (const module of course.modules) {
        // Estimate ~0.5MB per module
        estimatedStorageMB += 0.5
        
        for (const lesson of module.lessons) {
          // Estimate ~0.1MB per text lesson, more for video
          if (lesson.type === 'video') {
            estimatedStorageMB += 5 // Assume ~5MB per video lesson
          } else {
            estimatedStorageMB += 0.1 // ~100KB for text content
          }
        }
      }
    }
    
    // Convert to GB and add some buffer
    return Math.round((estimatedStorageMB / 1024) * 10) / 10
  } catch (error) {
    console.error('Error calculating storage usage:', error)
    return 0
  }
}