'use client';

import { Check, ChevronRight, Clock, Package, Plus, Rocket, Tag, Upload, BarChart, Activity } from 'lucide-react';

interface WelcomePopupProps {
  onNext: () => void;
}

export function WelcomePopup({ onNext }: WelcomePopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-0 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm mx-auto">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Welcome to Mall AI</h2>
          <p className="text-blue-100 text-center mt-2">
            Let's get you started with your CPG brand
          </p>
        </div>
        <div className="flex flex-col p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create your brand profile</h3>
                <p className="text-gray-500 text-sm">Set up your brand name, logo, and website</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Add your products</h3>
                <p className="text-gray-500 text-sm">Upload product details and images</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Connect social accounts</h3>
                <p className="text-gray-500 text-sm">Link your social media profiles</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ListingPopupProps {
  onNext: () => void;
}

export function ListingPopup({ onNext }: ListingPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-0 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm mx-auto">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Product Listings</h2>
          <p className="text-green-100 text-center mt-2">
            Create beautiful product listings for your brand
          </p>
        </div>
        <div className="flex flex-col p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Product Details</h3>
                <p className="text-gray-500 text-sm">Add name, description, and category</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Product Images</h3>
                <p className="text-gray-500 text-sm">Upload high-quality product photos</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UploadPopupProps {
  onNext: () => void;
}

export function UploadPopup({ onNext }: UploadPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-0 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm mx-auto">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Upload Methods</h2>
          <p className="text-purple-100 text-center mt-2">
            Two easy ways to add your products
          </p>
        </div>
        <div className="flex flex-col p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mr-3">
                <Plus className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manual Upload</h3>
                <p className="text-gray-500 text-sm">Add products one by one with detailed information</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mr-3">
                <Upload className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Bulk Upload</h3>
                <p className="text-gray-500 text-sm">Import multiple products at once using CSV</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              Got It
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GotItButtonProps {
  onClick: () => void;
}

export function GotItButton({ onClick }: GotItButtonProps) {
  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={onClick}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
      >
        Got it
        <Check className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

interface CountdownButtonProps {
  countdown: number;
  onClick: () => void;
}

export function CountdownButton({ countdown, onClick }: CountdownButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4">
      <div className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium shadow-md flex items-center">
        <Clock className="w-4 h-4 mr-2 text-blue-500" />
        {countdown}s
      </div>
      <button
        onClick={onClick}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
      >
        Welcome
        <ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

interface AnalyticsPopupProps {
  onNext: () => void;
}

export function AnalyticsPopup({ onNext }: AnalyticsPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-0 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm mx-auto">
            <BarChart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Activity Overview</h2>
          <p className="text-blue-100 text-center mt-2">
            Monitor and analyze your product performance
          </p>
        </div>
        <div className="flex flex-col p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Product Analytics</h3>
                <p className="text-gray-500 text-sm">Track performance of your active SKUs</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <BarChart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Performance Metrics</h3>
                <p className="text-gray-500 text-sm">View engagement and conversion data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Campaign Tracking</h3>
                <p className="text-gray-500 text-sm">Monitor your marketing campaigns</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActivityPopupProps {
  onNext: () => void;
}

export function ActivityPopup({ onNext }: ActivityPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-0 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm mx-auto">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Active Activities</h2>
          <p className="text-amber-100 text-center mt-2">
            Keep track of all activity around your products
          </p>
        </div>
        <div className="flex flex-col p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 mr-3">
                <Activity className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">User Engagement</h3>
                <p className="text-gray-500 text-sm">Track how users interact with your products</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 mr-3">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Recent Activity</h3>
                <p className="text-gray-500 text-sm">See the latest interactions and updates</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 mr-3">
                <Check className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Activity Notifications</h3>
                <p className="text-gray-500 text-sm">Get alerts for important events</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-medium flex items-center"
            >
              Got It
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 