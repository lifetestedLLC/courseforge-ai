export const courseGenerationPrompts = {
  outline: (niche: string, audience: string, modules: number) => `
    Create a comprehensive course outline for "${niche}" targeted at ${audience} learners.
    
    Requirements:
    - Generate exactly ${modules} modules
    - Each module should have 5-7 lessons
    - Include learning objectives for each module
    - Add practical exercises and assessments
    - Ensure logical progression of topics
    
    Format the response as JSON with this structure:
    {
      "title": "Course Title",
      "description": "Course description",
      "learningObjectives": ["objective1", "objective2"],
      "modules": [
        {
          "title": "Module Title",
          "description": "Module description",
          "objectives": ["objective1", "objective2"],
          "lessons": [
            {
              "title": "Lesson Title",
              "type": "video|text|interactive",
              "duration": 15,
              "content": "Lesson content outline"
            }
          ],
          "quiz": {
            "title": "Quiz Title",
            "questions": [
              {
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 0,
                "explanation": "Explanation text"
              }
            ]
          }
        }
      ]
    }
  `,
  
  lessonContent: (moduleTitle: string, lessonTitle: string, duration: number) => `
    Create detailed content for a lesson titled "${lessonTitle}" in the module "${moduleTitle}".
    
    Requirements:
    - Target duration: ${duration} minutes of reading/watching time
    - Write in an engaging, educational tone
    - Include practical examples and real-world applications
    - Add key takeaways at the end
    - Structure with clear headings and subheadings
    
    The content should be comprehensive yet accessible to the target audience.
  `,
  
  quizGeneration: (moduleTitle: string, lessonCount: number) => `
    Create a comprehensive quiz for the module "${moduleTitle}" covering all ${lessonCount} lessons.
    
    Requirements:
    - 5-8 questions total
    - Mix of multiple choice, true/false, and short answer
    - Questions should test understanding, not just memorization
    - Include explanations for each answer
    - Time limit: 2 minutes per question
    
    Format as JSON with questions array.
  `
}

export const contentEnhancementPrompts = {
  improveContent: (existingContent: string, improvements: string) => `
    Improve the following educational content based on these requirements: ${improvements}
    
    Original content:
    ${existingContent}
    
    Maintain the educational tone while making it more engaging and clear.
  `,
  
  generateMarketingCopy: (courseTitle: string, description: string) => `
    Create compelling marketing copy for a course titled "${courseTitle}".
    
    Course description: ${description}
    
    Generate:
    1. A catchy headline
    2. Course summary (100-150 words)
    3. Key benefits (bullet points)
    4. Target audience description
    5. Call-to-action text
    
    Make it persuasive and benefit-focused.
  `
}