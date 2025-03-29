import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function CampaignFalse({ ActiveCampaigns, setActiveCampaigns, addReward }) {
  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="w-full flex justify-center">
          <h3 className="text-lg font-medium mb-4">Campaign Details</h3>
        </div>
        <span className="text-sm text-zinc-600 mt-1.5">Edit your campaign information</span>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="Enter campaign name"
            />
          </div>
          <div className="space-y-2 mb-8">
            <Label htmlFor="campaign-description">Campaign Description</Label>
            <Textarea
              id="campaign-description"
              placeholder="Describe your campaign"
            />
          </div>
          <div className="space-y-2 mt-4">
            {ActiveCampaigns.rewards.map((reward, index) => (
              <div key={index} className="space-y-4 border mt-4 rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor={`reward-name-${index}`}>Reward Name</Label>
                  <Input
                    id={`reward-name-${index}`}
                    value={reward.name}
                    onChange={(e) => {
                      const updatedRewards = [...ActiveCampaigns.rewards]
                      updatedRewards[index].name = e.target.value
                      setActiveCampaigns({ ...ActiveCampaigns, rewards: updatedRewards })
                    }}
                    placeholder="Enter reward name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`reward-description-${index}`}>Reward Description</Label>
                  <Textarea
                    id={`reward-description-${index}`}
                    value={reward.description}
                    onChange={(e) => {
                      const updatedRewards = [...ActiveCampaigns.rewards]
                      updatedRewards[index].description = e.target.value
                      setActiveCampaigns({ ...ActiveCampaigns, rewards: updatedRewards })
                    }}
                    placeholder="Describe the reward"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reward Image</Label>
                  <div className="flex items-center space-x-4">
                    {ActiveCampaigns.rewards && reward.image == "" ? (
                      <div>
                        <Image src={reward.image} alt="" width={100} height={100} className="rounded-md" />
                      </div>
                    ) : (
                      <div className="rounded-md w-[100px] h-[100px] bg-gray-50"></div>
                    )}
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={addReward}
              className="bg-emerald-600 flex text-sm py-2 mt-4 cursor-pointer justify-center hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
            >
              <div className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                <Plus className="w-2 h-2" />
              </div>
              New Reward
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
