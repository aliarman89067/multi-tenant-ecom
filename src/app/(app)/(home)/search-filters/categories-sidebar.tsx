import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { CategoriesGetMenyOutputs } from '@/modules/categories/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const router = useRouter()
  const [parentCategories, setParentCategories] = useState<CategoriesGetMenyOutputs | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoriesGetMenyOutputs[1] | null>(null)

  const trpc = useTRPC()
  const { data } = useQuery(trpc.categories.getMany.queryOptions())

  //If we have parent categories show them otherwise show root categories
  const currentCategories = parentCategories ?? data ?? []

  const handleOpenChange = (value: boolean) => {
    setSelectedCategory(null)
    setParentCategories(null)
    onOpenChange(value)
  }

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null)
      setSelectedCategory(null)
    }
  }

  const handleCategoryClick = (category: CategoriesGetMenyOutputs[0]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetMenyOutputs)
      setSelectedCategory(category)
    } else {
      //This is a leaf category not subcategory
      if (parentCategories && selectedCategory) {
        //This is a subcategory - navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else {
        //This is a main category - navigate to /category
        if (category.slug === 'all') {
          router.push('/')
        } else {
          router.push(`/${category.slug}`)
        }
      }
      handleOpenChange(false)
    }
  }

  const backgroundColor = selectedCategory?.color || '#fff'

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: parentCategories ? backgroundColor : '#fff' }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium justify-between"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
