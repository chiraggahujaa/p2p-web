import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import React from 'react'

const HeroSection = () => {
  return (
          <section className="relative pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rent Smart, Live Better
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Borrow. Share. Thrive.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access what you need, when you need it. Join thousands who choose sharing over owning.
            </p>
          </div>
        </div>
      </section>
  )
}

export default HeroSection