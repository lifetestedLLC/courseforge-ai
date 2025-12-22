'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Sparkles } from 'lucide-react'

interface CourseGeneratorFormProps {
  onGenerationComplete?: (course: any) => void
}

export function CourseGeneratorForm({ onGenerationComplete }: CourseGeneratorFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  // Form state
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('beginners')
  const [modules, setModules] = useState([6])
  const [formats, setFormats] = useState<string[]>(['video', 'text'])
  const [language, setLanguage] = useState('english')
  const [tone, setTone] = useState('professional')
  
  const totalSteps = 3
  
  const handleGenerateCourse = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)
      
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche,
          audience,
          modules: modules[0],
          formats,
          language,
          tone
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate course')
      }
      
      const course = await response.json()
      
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      toast({
        title: 'Course Generated Successfully!',
        description: 'Your AI-powered course has been created.',
      })
      
      if (onGenerationComplete) {
        onGenerationComplete(course)
      } else {
        router.push(`/dashboard/courses/${course.id}`)
      }
      
    } catch (error) {
      console.error('Error generating course:', error)
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating your course. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  const canProceed = () => {
    switch (step) {
      case 1:
        return niche.trim().length > 0
      case 2:
        return formats.length > 0
      case 3:
        return true
      default:
        return false
    }
  }
  
  if (isGenerating) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generating Your Course
          </CardTitle>
          <CardDescription>
            Our AI is creating a comprehensive course structure for you...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={generationProgress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {generationProgress < 30 && 'Analyzing your requirements...'}
            {generationProgress >= 30 && generationProgress < 60 && 'Creating course outline...'}
            {generationProgress >= 60 && generationProgress < 90 && 'Generating lessons and quizzes...'}
            {generationProgress >= 90 && 'Finalizing your course...'}
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Course Generator</CardTitle>
        <CardDescription>
          Step {step} of {totalSteps}: Create your AI-powered course
        </CardDescription>
        <Progress value={(step / totalSteps) * 100} className="w-full mt-4" />
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="niche">Course Topic or Niche</Label>
              <Input
                id="niche"
                placeholder="e.g., Digital Marketing for Small Businesses"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginners">Beginners</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mixed">Mixed Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Number of Modules: {modules[0]}</Label>
              <Slider
                value={modules}
                onValueChange={setModules}
                min={3}
                max={12}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <Label>Course Format</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="video"
                  checked={formats.includes('video')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormats([...formats, 'video'])
                    } else {
                      setFormats(formats.filter(f => f !== 'video'))
                    }
                  }}
                />
                <Label htmlFor="video" className="font-normal">Video Lessons</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="text"
                  checked={formats.includes('text')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormats([...formats, 'text'])
                    } else {
                      setFormats(formats.filter(f => f !== 'text'))
                    }
                  }}
                />
                <Label htmlFor="text" className="font-normal">Text Content</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="interactive"
                  checked={formats.includes('interactive')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormats([...formats, 'interactive'])
                    } else {
                      setFormats(formats.filter(f => f !== 'interactive'))
                    }
                  }}
                />
                <Label htmlFor="interactive" className="font-normal">Interactive Elements</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assignments"
                  checked={formats.includes('assignments')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormats([...formats, 'assignments'])
                    } else {
                      setFormats(formats.filter(f => f !== 'assignments'))
                    }
                  }}
                />
                <Label htmlFor="assignments" className="font-normal">Assignments & Quizzes</Label>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Course Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tone">Content Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Course: {niche || 'Not specified'}</li>
                <li>• Audience: {audience}</li>
                <li>• Modules: {modules[0]}</li>
                <li>• Formats: {formats.join(', ')}</li>
                <li>• Language: {language}</li>
                <li>• Tone: {tone}</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <div className="flex items-center justify-between p-6 pt-0">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </Button>
        
        {step < totalSteps ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleGenerateCourse}
            disabled={!canProceed()}
          >
            Generate Course
          </Button>
        )}
      </div>
    </Card>
  )
}