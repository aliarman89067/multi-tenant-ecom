import React from 'react'
import { Category } from '@/payload-types'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { SearchFilters } from './search-filters'
import { getPayload } from 'payload'
import configPayload from '@payload-config'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const payload = await getPayload({
    config: configPayload,
  })
  const data = await payload.find({
    collection: 'categories',
    // We add depth 1 for populate subcategories
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  })
  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // As we added depth 1. We know that doc will type category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }))
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
