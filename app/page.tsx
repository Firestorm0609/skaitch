'use client'

import Link from 'next/link'
import { Sparkles, Brush, Layers, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-skaitch-dark via-skaitch-purple/20 to-skaitch-cyan/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-skaitch-purple to-skaitch-cyan bg-clip-text text-transparent">
            SKAITCH
          </h1>
          <Link
            href="/editor"
            className="px-6 py-2 bg-white text-skaitch-purple rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-6">
            Sketch. Assist. Create.
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            The first drawing platform where you and AI collaborate turn-by-turn.
            Draw, click assist, and watch your vision come to life.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-skaitch-purple to-skaitch-cyan text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Brush className="w-8 h-8" />}
            title="Professional Tools"
            description="Full drawing suite with brushes, shapes, layers, and more"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Selective AI Assist"
            description="AI helps only where you want, when you want - you stay in control"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Mint as NFT"
            description="Turn your art into NFTs on Solana with full provenance tracking"
          />
        </div>

        {/* How It Works */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How Skaitch Works
          </h3>
          <div className="space-y-8">
            <Step
              number="1"
              title="Draw Your Sketch"
              description="Use professional drawing tools to create your initial sketch"
            />
            <Step
              number="2"
              title="Click AI Assist"
              description='Select an area, click "Assist", and tell the AI what you need'
            />
            <Step
              number="3"
              title="Review & Continue"
              description="Accept the AI suggestion or try again. Then keep drawing yourself"
            />
            <Step
              number="4"
              title="Mint Your Art"
              description="Export or mint as an NFT with full creation provenance"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">
        <div className="text-center text-white/60 text-sm">
          <p>Built for Solana Graveyard Hackathon 2026</p>
          <p className="mt-2">Where sketch meets AI ✨</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-skaitch-purple/50 transition-all">
      <div className="text-skaitch-cyan mb-4">{icon}</div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-white/70">{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-skaitch-purple to-skaitch-cyan flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  )
}
