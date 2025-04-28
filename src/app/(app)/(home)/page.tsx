import configPayload from '@payload-config'
import { getPayload } from 'payload'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const Home = async () => {
  const payload = await getPayload({
    config: configPayload,
  })
  const data = await payload.find({
    collection: 'categories',
  })
  console.log(data)
  return <div className="flex flex-col gap-4 p-4">{JSON.stringify(data)}</div>
}

export default Home
