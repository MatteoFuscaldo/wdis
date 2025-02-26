'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ThumbsUp, ThumbsDown, Share2, X } from 'lucide-react'
import { motivationalSentences } from './data/motivationalSentences'
import { db } from '@/lib/firebase'
import { ref, push, serverTimestamp } from 'firebase/database'

// Define types for better type safety
type Category = {
  name: string
  icon: string
}

type VoteType = 'upvote' | 'downvote' | null

type VoteCounts = {
  upvotes: number
  downvotes: number
}

type SharePlatform = 'whatsapp' | 'twitter'

const categories: Category[] = [
  { name: 'Diet', icon: '🥗' },
  { name: 'Gym', icon: '💪' },
  { name: 'Work', icon: '💼' },
  { name: 'Alcohol', icon: '🍺' },
  { name: 'Drugs', icon: '💊' },
]

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentSentence, setCurrentSentence] = useState<string>('')
  const [votes, setVotes] = useState<VoteCounts>({ upvotes: 0, downvotes: 0 })
  const [userVote, setUserVote] = useState<VoteType>(null)
  const [voteSubmitting, setVoteSubmitting] = useState(false)

  // Check if we're on client-side once on component mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  const getRandomSentence = (category: string): string => {
    const sentences = motivationalSentences[category]
    if (!sentences || sentences.length === 0) {
      return "No motivational sentences available for this category."
    }
    return sentences[Math.floor(Math.random() * sentences.length)]
  }

  const handleIconClick = (category: string): void => {
    if (!isClient) return
    
    const sentence = getRandomSentence(category)
    setSelectedCategory(category)
    setCurrentSentence(sentence)
    setShowPopup(true)
    
    // Reset voting state
    setVotes({ upvotes: 0, downvotes: 0 })
    setUserVote(null)
  }

  const saveVoteToFirebase = async (voteData: {
    category: string;
    sentence: string;
    voteType: 'upvote' | 'downvote';
    timestamp: object;
  }) => {
    try {
      // Reference to the votes collection in Firebase
      const votesRef = ref(db, 'votes')
      
      // Push the new vote entry with a unique ID
      await push(votesRef, voteData)
      return true
    } catch (error) {
      console.error('Error saving vote to Firebase:', error)
      return false
    }
  }

  const handleVote = async (type: 'upvote' | 'downvote'): Promise<void> => {
    if (!isClient || !selectedCategory || !currentSentence) return
    
    // Check if we're already processing a vote
    if (voteSubmitting) return
    
    // Immediately update UI for responsiveness
    setVotes(prev => {
      if (userVote === type) {
        // Clicking the same button again - remove the vote
        return {
          ...prev,
          [type === 'upvote' ? 'upvotes' : 'downvotes']: prev[type === 'upvote' ? 'upvotes' : 'downvotes'] - 1
        }
      } else if (userVote === null) {
        // First time voting
        return {
          ...prev,
          [type === 'upvote' ? 'upvotes' : 'downvotes']: prev[type === 'upvote' ? 'upvotes' : 'downvotes'] + 1
        }
      } else {
        // Switching vote from upvote to downvote or vice versa
        return {
          upvotes: 
            type === 'upvote' 
              ? prev.upvotes + 1 
              : prev.upvotes - 1,
          downvotes: 
            type === 'downvote' 
              ? prev.downvotes + 1 
              : prev.downvotes - 1
        }
      }
    })
    
    // Update local vote state
    const previousVote = userVote
    setUserVote(userVote === type ? null : type)
    
    // If the user clicked the same vote type again (canceling a vote), no need to send to Firebase
    if (userVote === type) {
      return
    }
    
    // Set submitting state to prevent multiple clicks
    setVoteSubmitting(true)
    
    // Prepare data for Firebase
    const voteData = {
      category: selectedCategory,
      sentence: currentSentence,
      voteType: type,
      timestamp: serverTimestamp()
    }
    
    // Try to save to Firebase
    const success = await saveVoteToFirebase(voteData)
    
    // Reset submitting state after attempt
    setVoteSubmitting(false)
    
    // If there was an error saving to Firebase, log it but don't affect the user experience
    if (!success) {
      console.log('Vote was counted locally but not saved to database')
    }
  }

  const handleShare = (platform: SharePlatform): void => {
    if (!currentSentence || !selectedCategory) return;
    
    const text = `${selectedCategory}: ${currentSentence}`;
    const encodedText = encodeURIComponent(text);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`
    };
    
    window.open(shareUrls[platform], '_blank');
  }

  // Prevent hydration issues with a loading state
  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background text-foreground font-meslo">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Remind me: Why Did I Start?</h1>
      <h2 className="text-lg md:text-xl mb-8 text-center">Pick your poison.</h2>
      
      <div className="flex flex-wrap justify-center gap-3 md:space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="text-2xl p-4 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleIconClick(category.name)}
            aria-label={`Select ${category.name} category`}
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="bg-card p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center flex flex-col items-center text-card-foreground"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-card-foreground">{selectedCategory}</h2>
              <p className="mb-6 text-lg">{currentSentence}</p>
              
              <div className="flex gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={() => handleVote('upvote')}
                  className={`flex items-center gap-2 transition-colors ${userVote === 'upvote' ? 'bg-primary text-primary-foreground' : ''}`}
                  aria-label="Upvote"
                  disabled={voteSubmitting}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{votes.upvotes}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVote('downvote')}
                  className={`flex items-center gap-2 transition-colors ${userVote === 'downvote' ? 'bg-primary text-primary-foreground' : ''}`}
                  aria-label="Downvote"
                  disabled={voteSubmitting}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{votes.downvotes}</span>
                </Button>
              </div>
              
              <div className="space-y-2 w-full">
                <Button 
                  onClick={() => handleShare('whatsapp')} 
                  className="flex items-center justify-center w-full"
                  variant="outline"
                  aria-label="Share on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => handleShare('twitter')} 
                  className="flex items-center justify-center w-full"
                  variant="outline"
                  aria-label="Share on X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="mt-4" 
                onClick={() => setShowPopup(false)}
                aria-label="Close popup"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-auto pt-8">
        <ThemeToggle />
      </div>
    </main>
  )
}
