import { Input } from "@/components/ui/input";
import { SocialConnect } from "../social-connect";

const MediaFalse = ({ product }) => (
  <div className="p-0">
    <div className="w-full flex justify-center">
      <h3 className="text-lg font-medium mb-4">Social Platforms</h3>
    </div>
    <div className="space-y-6">
      <div>
        <div className="space-y-4">
          {[
            { platform: "Instagram", url: "https://www.instagram.com/" },
            { platform: "Facebook", url: "https://facebook.com/" },
            { platform: "Twitter", url: "https://x.com/" }
          ].map((social, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <Input 
                name={`socialLinks.${index}.platform`}
                defaultValue={social.platform}
              />
              <Input 
                name={`socialLinks.${index}.url`}
                defaultValue={social.url}
                className="col-span-2"
              />
            </div>
          ))}
        </div>
      </div>
      <SocialConnect socialAccounts={product.socialAccounts} />
    </div>
  </div>
);

export default MediaFalse;
