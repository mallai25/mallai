import { Input } from "@/components/ui/input";
import { ConnectMedia } from "@/components/ConnectMedia";

const MediaTrue = () => (
  <div className="p-0">
    <div className="w-full flex justify-center">
      <h3 className="text-lg font-medium mb-4">Social Platforms</h3>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Input placeholder="Instagram URL" />
        <Input placeholder="TikTok URL" />
        <Input placeholder="Twitter URL" />
      </div>
      <div>
        <h3 className='my-4 text-md flex justify-center font-medium text-gray-500'>or</h3>
      </div>
      <ConnectMedia />
    </div>
  </div>
);

export default MediaTrue;
