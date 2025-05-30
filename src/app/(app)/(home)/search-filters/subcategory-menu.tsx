import Link from 'next/link'

import { Category } from '@/payload-types'
import { CategoriesGetMenyOutputs } from '@/modules/categories/types'

interface Props {
  category: CategoriesGetMenyOutputs[0]
  isOpen: boolean
  position: { top: number; left: number }
}

export const SubcategoryMenu = ({ category, isOpen, position }: Props) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null
  }
  const backgroundColor = category.color || '#f5f5f5'
  return (
    <div className="fixed z-100" style={{ top: position.top, left: position.left }}>
      {/* Invisible bridge to maintain hover */}
      <div className="h-5 w-60 -translate-y-1.5" />
      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-2 -translate-y-2"
      >
        <div>
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
