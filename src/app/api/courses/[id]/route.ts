import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateCourseSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  price: z.number().min(0).optional()
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const course = await db.course.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        modules: {
          include: {
            lessons: true,
            quiz: {
              include: {
                questions: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }
    
    return NextResponse.json(course)
    
  } catch (error) {
    console.error('Error fetching course:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const json = await req.json()
    const body = updateCourseSchema.parse(json)
    
    // Verify course ownership
    const existingCourse = await db.course.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    
    if (!existingCourse) {
      return new NextResponse('Course not found', { status: 404 })
    }
    
    const course = await db.course.update({
      where: {
        id: params.id
      },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(course)
    
  } catch (error) {
    console.error('Error updating course:', error)
    
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // Verify course ownership
    const course = await db.course.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    
    if (!course) {
      return new NextResponse('Course not found', { status: 404 })
    }
    
    await db.course.delete({
      where: {
        id: params.id
      }
    })
    
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    console.error('Error deleting course:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}