import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const PollingTrue = () => (
  <div className="p-0">
    <div className="w-full flex justify-center">
      <h3 className="text-lg font-medium mb-4">Product Polling</h3>
    </div>
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 font-medium text-gray-700">
            Survey Title
          </label>
          <Input 
            name="surveyTitle"
            placeholder="e.g., Product Experience Survey"
          />
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4">Comparison Questions</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Product A</label>
              <Input placeholder="e.g., Our Product" />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Product B</label>
              <Input placeholder="e.g., Competitor Product" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Questions</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="e.g., Which product has better taste?" className="flex-1" />
                <div 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  role="button"
                >
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4">Rating Categories</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="e.g., Taste Quality" className="flex-1" />
            <div 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
              role="button"
            >
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4">Target Demographics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Age Range</label>
            <Input placeholder="e.g., 18-24" />
          </div>
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Location</label>
            <Input placeholder="e.g., United States" />
          </div>
        </div>
      </div>
      <div 
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-full px-6 py-3 mt-6 flex items-center justify-center space-x-2 transition-colors duration-200 ease-in-out cursor-pointer select-none"
        role="button"
      >
        <div className="bg-emerald-500 text-white rounded-full p-1">
          <Plus className="w-4 h-4" />
        </div>
        <span>Create Poll</span>
      </div>
    </div>
  </div>
);

export default PollingTrue;
