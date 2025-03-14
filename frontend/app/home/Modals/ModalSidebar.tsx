import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, BarChart } from 'lucide-react';

const ModalSidebar = () => (
  <div className="w-full mb-2">
    <ScrollArea className="w-full pb-2">
      <TabsList className="flex h-auto w-full bg-transparent space-x-2 p-2">
        <TabsTrigger 
          value="info" 
          className="flex-1 justify-center px-4 py-2 rounded-full data-[state=active]:bg-gray-100"
        >
          <div className="flex items-center justify-center">
            <Tag className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Product Info</span>
            <span className="sm:hidden">Info</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="catalog"
          className="flex-1 justify-center px-4 py-2 rounded-full data-[state=active]:bg-gray-100"
        >
          <div className="flex items-center justify-center">
            <BarChart className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Similar Catalog</span>
            <span className="sm:hidden">Catalog</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
);

export default ModalSidebar;
