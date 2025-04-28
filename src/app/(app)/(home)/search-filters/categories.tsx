'use client'
import { Category } from '@/payload-types'
import { CategoryDropdown } from './category-dropdown'
import { CustomCategory } from '../types'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ListFilterIcon } from 'lucide-react'
import { CategoriesSidebar } from './categories-sidebar'

interface CategoriesProps {
  data: CustomCategory[]
}

export const Categories = ({ data }: CategoriesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeCategory = 'all'

  const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory)
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

  useEffect(() => {
    const calculateVisibleWidth = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const viewAllWidth = viewAllRef.current.offsetWidth
      const availableWidth = containerWidth - viewAllWidth

      const menuItems = Array.from(measureRef.current.children)
      let totalWidth = 0
      let visible = 0
      for (const item of menuItems) {
        const width = item.getBoundingClientRect().width
        if (totalWidth + width > availableWidth) break
        totalWidth += width
        visible++
      }
      setVisibleCount(visible)
    }
    const resizeObserve = new ResizeObserver(calculateVisibleWidth)
    resizeObserve.observe(containerRef.current!)
    return () => resizeObserve.disconnect()
  }, [data.length])

  return (
    <div className="relative w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data} />
      {/* Hidden div to measure all item */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: 'fixed', top: -9999, left: -9999 }}
      >
        {data.map((category: CustomCategory) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      {/* Visible Items */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        className="flex flex-nowrap items-center"
      >
        {data.slice(0, visibleCount).map((category: CustomCategory) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              'h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
              isActiveCategoryHidden && !isAnyHovered && 'bg-white border-primary',
            )}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
