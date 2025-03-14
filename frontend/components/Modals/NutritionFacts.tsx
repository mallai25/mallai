
const NutritionFactsModal = () => (
    <div className="space-y-6">
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10"
          strokeDasharray={`${(70 / 200) * 283} 283`} transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out"/>
        <text x="50" y="45" textAnchor="middle" className="text-2xl font-bold" fill="#10b981">70</text>
        <text x="50" y="65" textAnchor="middle" className="text-xs" fill="#64748b">calories</text>
      </svg>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-50 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-blue-600 mb-1">Total Sugars</p>
        <p className="text-lg font-semibold text-gray-900">4g</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-purple-600 mb-1">Net Carbs</p>
        <p className="text-lg font-semibold text-gray-900">16g</p>
      </div>
      <div className="bg-emerald-50 rounded-xl p-3 text-center col-span-2">
        <p className="text-sm font-medium text-emerald-600 mb-1">Fiber</p>
        <p className="text-lg font-semibold text-gray-900">8g</p>
      </div>
    </div>
    <div className="border border-gray-200 rounded-lg p-4">
      <table className="w-full text-sm">
        <tbody>
          <tr><td colSpan={2} className="font-bold border-b pb-2">Serving Size 4 Pieces (32g)</td></tr>
          <tr><td className="py-1">Total Fat</td><td className="text-right">0g (0%)</td></tr>
          <tr><td className="py-1">Sodium</td><td className="text-right">95mg (4%)</td></tr>
          <tr><td className="py-1">Total Carbohydrate</td><td className="text-right">24g (9%)</td></tr>
          <tr><td className="pl-4 py-1">Total Sugars</td><td className="text-right">4g</td></tr>
          <tr><td className="pl-4 py-1">Fiber</td><td className="text-right">8g (29%)</td></tr>
          <tr><td className="py-1">Protein</td><td className="text-right">1g</td></tr>
          <tr><td className="border-t pt-2">Iron</td><td className="border-t pt-2 text-right">1mg (6%)</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default NutritionFactsModal;
