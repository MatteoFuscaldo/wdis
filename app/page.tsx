'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
// if the new import works this is to be removed
// import { X, Send } from 'lucide-react'
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
      const websiteLink = process.env.NEXT_PUBLIC_SITE_URL || 'https://wdis.cool'
      const fullMessage = `${text}\n\nVisit: ${websiteLink}`
      const encodedMessage = encodeURIComponent(fullMessage)
      
      if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, '_blank')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 font-meslo">
      <h1 className="text-4xl font-bold mb-4 text-center">Remind me: Why Did I Start?</h1>
      <h2 className="text-xl mb-8 text-center">Pick your poison.</h2>
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
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => handleShare('twitter')} 
                  className="flex items-center justify-center"
                  variant="outline"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
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

