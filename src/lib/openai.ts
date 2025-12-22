import OpenAI from 'openai'
import { courseGenerationPrompts } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface CourseGenerationParams {
  niche: string
  audience: 'beginners' | 'intermediate' | 'advanced' | 'mixed'
  modules: number
  formats: string[]
  language?: string
  tone?: string
}

export interface GeneratedCourse {
  title: string
  description: string
  learningObjectives: string[]
  modules: GeneratedModule[]
  settings: {
    niche: string
    audience: string
    modules: number
    formats: string[]
  }
}

export interface GeneratedModule {
  title: string
  description: string
  objectives: string[]
  lessons: GeneratedLesson[]
  quiz: GeneratedQuiz
}

export interface GeneratedLesson {
  title: string
  type: string
  duration: number
  content: string
}

export interface GeneratedQuiz {
  title: string
  questions: GeneratedQuestion[]
  timeLimit: number
}

export interface GeneratedQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export async function generateCourseStructure(params: CourseGenerationParams): Promise<GeneratedCourse> {
  try {
    const prompt = courseGenerationPrompts.outline(
      params.niche,
      params.audience,
      params.modules
    )
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer. Create well-structured, engaging course content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }
    
    // Parse the JSON response
    const courseData = JSON.parse(content)
    
    return {
      ...courseData,
      settings: {
        niche: params.niche,
        audience: params.audience,
        modules: params.modules,
        formats: params.formats
      }
    }
  } catch (error) {
    console.error('Error generating course:', error)
    throw new Error('Failed to generate course structure')
  }
}

export async function enhanceLessonContent(
  moduleTitle: string,
  lessonTitle: string,
  existingContent: string,
  improvements: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert content creator. Enhance educational content while maintaining clarity and engagement."
        },
        {
          role: "user",
          content: `Improve this lesson content for "${lessonTitle}" in module "${moduleTitle}":

${existingContent}

Improvements requested: ${improvements}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    })
    
    return response.choices[0]?.message?.content || existingContent
  } catch (error) {
    console.error('Error enhancing content:', error)
    return existingContent
  }
}

export async function generateQuizForModule(
  moduleTitle: string,
  lessonTitles: string[]
): Promise<GeneratedQuiz> {
  try {
    const prompt = courseGenerationPrompts.quizGeneration(moduleTitle, lessonTitles.length)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert assessment designer. Create comprehensive quizzes that test understanding."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No quiz generated')
    }
    
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating quiz:', error)
    throw new Error('Failed to generate quiz')
  }
}