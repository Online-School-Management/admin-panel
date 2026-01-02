import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { useCreateSubject, useUpdateSubject, useSubject } from '../hooks/useSubjects'
import type { CreateSubjectInput, UpdateSubjectInput } from '../types/subject.types'
import { createSubjectSchema, updateSubjectSchema, type CreateSubjectFormData, type UpdateSubjectFormData } from '../schemas/subject.schemas'
import { useTranslation } from '@/i18n/context'

interface SubjectFormProps {
  subjectSlug?: string
}

/**
 * SubjectForm component - handles both create and edit
 */
export function SubjectForm({ subjectSlug }: SubjectFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!subjectSlug

  const { 
    data: subjectData, 
    isLoading: isLoadingSubject,
    isFetching: isFetchingSubject,
    dataUpdatedAt: subjectDataUpdatedAt,
  } = useSubject(
    subjectSlug || ''
  )

  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()

  // Select schema based on edit mode
  const subjectFormSchema = useMemo(() => {
    return isEditMode ? updateSubjectSchema : createSubjectSchema
  }, [isEditMode])

  // Type for form data based on mode
  type SubjectFormData = CreateSubjectFormData | UpdateSubjectFormData

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Track the last dataUpdatedAt timestamp and subjectSlug we used to populate the form
  const lastPopulatedRef = useRef<{ subjectSlug: string; timestamp: number } | null>(null)
  
  // Populate form values when subject data loads (edit mode)
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !subjectSlug) {
      lastPopulatedRef.current = null
      return
    }
    
    // Wait for subject data to be loaded
    if (isLoadingSubject || isFetchingSubject || !subjectData?.data) return
    
    // Check if we need to populate
    const shouldPopulate = 
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.subjectSlug !== subjectSlug ||
      subjectDataUpdatedAt > lastPopulatedRef.current.timestamp
    
    if (!shouldPopulate) return
    
    const subject = subjectData.data
    
    // Reset form with all values at once using reset()
    reset({
      name: subject.name || '',
      description: subject.description || '',
    }, {
      keepDefaultValues: false,
    })
    
    // Update the last populated tracking
    lastPopulatedRef.current = {
      subjectSlug,
      timestamp: subjectDataUpdatedAt,
    }
  }, [isEditMode, subjectSlug, subjectData, isLoadingSubject, isFetchingSubject, subjectDataUpdatedAt, reset])

  const onSubmit = async (data: SubjectFormData) => {
    if (isEditMode && subjectSlug) {
      const updateFormData = data as UpdateSubjectFormData
      const updateData: UpdateSubjectInput = {
        name: updateFormData.name || undefined,
        description: updateFormData.description || undefined,
      }
      updateSubject.mutate({ slug: subjectSlug, data: updateData })
    } else {
      const createFormData = data as CreateSubjectFormData
      const createData: CreateSubjectInput = {
        name: createFormData.name,
        description: createFormData.description || undefined,
      }
      createSubject.mutate(createData)
    }
  }

  if (isEditMode && isLoadingSubject) {
    return <FormSkeleton fieldsPerColumn={2} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t('subject.pages.edit') : t('subject.pages.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          key={isEditMode ? `subject-form-${subjectSlug}` : 'subject-form-create'}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('subject.form.name')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('subject.form.enterName')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">{t('subject.form.description')}</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder={t('subject.form.enterDescription')}
                  disabled={isSubmitting}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/subjects')}
              disabled={isSubmitting || createSubject.isPending || updateSubject.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('subject.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting || createSubject.isPending || updateSubject.isPending}
            >
              {(isSubmitting || createSubject.isPending || updateSubject.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('subject.messages.updating')
                    : t('subject.messages.creating')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('subject.actions.update')
                    : t('subject.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

