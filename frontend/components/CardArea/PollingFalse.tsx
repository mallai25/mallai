import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { ComparisonComponent } from "../comparisonPolls";

const PollingFalse = () => (
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
            defaultValue="JoyRide Product Experience Survey"
          />
        </div>
        <div>
          <label className="block text-sm mb-2 font-medium text-gray-700">
            Description
          </label>
          <Textarea 
            name="surveyDescription"
            defaultValue="Help us improve our products by sharing your feedback"
            className="h-20"
          />
        </div>
      </div>
      <ComparisonComponent />
      <div 
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-full px-6 py-3 mt-6 flex items-center justify-center space-x-2 transition-colors duration-200 ease-in-out cursor-pointer select-none"
        role="button"
      >
        <div className="bg-emerald-500 text-white rounded-full p-1">
          <Plus className="w-4 h-4" />
        </div>
        <span>Add Item</span>
      </div>
    </div>
  </div>
);

export default PollingFalse;
