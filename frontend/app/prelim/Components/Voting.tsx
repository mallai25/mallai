'use client'

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { FIREBASE_DB } from '../../../FirebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { Card, CardContent } from "@/components/ui/card"

// Update interface to match HistoryTab poll structure
interface VotingProps {
  polls: Array<{
    id: string;
    title: string;
    products: Array<{
      name: string;
      votes: number;
    }>;
  }>;
  productId: string;
}

export function Voting({ polls, productId }: VotingProps) {
  const [votedPolls, setVotedPolls] = useState<{pollId: string, productIndex: number}[]>([]);
  const [localPolls, setLocalPolls] = useState(polls);

  useEffect(() => {
    setLocalPolls(polls);
  }, [polls]);

  const handleVote = async (pollId: string, productIndex: number) => {
    try {
      // Change the reference to include a collection and document ID
      const pollRef = doc(FIREBASE_DB, 'products', productId, 'polls', pollId);
      const pollToUpdate = localPolls.find(p => p.id === pollId);
      
      if (!pollToUpdate) return;

      // Check if already voted
      const alreadyVoted = votedPolls.some(vote => vote.pollId === pollId && vote.productIndex === productIndex);

      // Create updated products array
      const updatedProducts = pollToUpdate.products.map((product, idx) => ({
        ...product,
        votes: idx === productIndex 
          ? product.votes + (alreadyVoted ? -1 : 1)
          : product.votes
      }));

      // Update local state first for immediate feedback
      setLocalPolls(prev =>
        prev.map(poll =>
          poll.id === pollId
            ? {
                ...poll,
                products: updatedProducts
              }
            : poll
        )
      );

      // Update Firebase
      await updateDoc(pollRef, {
        products: updatedProducts,
        lastUpdated: new Date().toISOString()
      });

      // Update voted polls state
      if (alreadyVoted) {
        setVotedPolls(prev => prev.filter(vote => 
          !(vote.pollId === pollId && vote.productIndex === productIndex)
        ));
      } else {
        setVotedPolls(prev => [...prev, { pollId, productIndex }]);
      }

    } catch (error) {
      console.error('Error updating vote:', error);
      // Revert local state if Firebase update fails
      setLocalPolls(polls);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Tabs defaultValue="current" className="w-full">
        <div className="flex justify-center">
        <TabsList className="mb-4 w-[300px] sm:w-[400px] bg-transparent">
        <TabsTrigger 
              value="current" 
              className="data-[state=active]:bg-emerald-600 w-full rounded-full data-[state=active]:text-white shadow-sm border bg-white hover:bg-gray-50 data-[state=active]:hover:bg-emerald-600"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Current</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="current">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {localPolls.map((poll) => (
              <>
              {poll.products.map((product, productIndex) => {
                      const totalVotes = poll.products.reduce((sum, p) => sum + p.votes, 0);
                      const percentage = totalVotes > 0 ? (product.votes / totalVotes) * 100 : 0;
                      
                      return (
<Card key={productIndex} className="w-full max-w-[350px] sm:w-[300px] bg-white">
                <CardContent className="p-4">
                  <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold">{product.name}</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                productIndex === 0 ? 'bg-yellow-500' :
                                productIndex === 1 ? 'bg-blue-500' :
                                productIndex === 2 ? 'bg-green-500' :
                                'bg-gray-400'
                              } rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={() => handleVote(poll.id, productIndex)}
                              className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                                ${votedPolls.some(v => v.pollId === poll.id && v.productIndex === productIndex)
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'border border-gray-300 hover:border-gray-400'
                                }`}
                              aria-label="Vote"
                            >
                              {votedPolls.some(v => v.pollId === poll.id && v.productIndex === productIndex) 
                                ? 'Remove Vote' 
                                : 'Vote'}
                            </button>
                          </div>
                        </div>

                  </div>
                </CardContent>
              </Card>
                      );
                    })}
              
              </>
                    
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}