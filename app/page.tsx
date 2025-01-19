'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Send } from 'lucide-react'
import { motivationalSentences } from './data/motivationalSentences'

const categories = [
  { name: 'Diet', icon: '🥗' },
  { name: 'Gym', icon: '💪' },
  { name: 'Work', icon: '💼' },
  { name: 'Alcohol', icon: '🍺' },
  { name: 'Drugs', icon: '💊' },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentSentence, setCurrentSentence] = useState<string>('')

  const getRandomSentence = (category: string) => {
    const sentences = motivationalSentences[category]
    return sentences[Math.floor(Math.random() * sentences.length)]
  }

  const handleIconClick = (category: string) => {
    setSelectedCategory(category)
    setCurrentSentence(getRandomSentence(category))
    setShowPopup(true)
  }

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (selectedCategory) {
      const text = `Remind me why I started: ${currentSentence}`
      const encodedText = encodeURIComponent(text)
      
      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodedText}`, '_blank')
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Remind me why I started</h1>
      <div className="flex space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="text-2xl p-4"
            onClick={() => handleIconClick(category.name)}
          >
            {category.icon}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {showPopup && selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
              <p className="mb-6">{currentSentence}</p>
              <div className="flex space-x-4 w-full justify-center">
                <Button 
                  onClick={() => handleShare('whatsapp')} 
                  className="flex items-center justify-center"
                  variant="outline"
                >
                  <Send className="mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => handleShare('twitter')} 
                  className="flex items-center justify-center"
                  variant="outline"
                >
                  <X className="mr-2" />
                  X
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

