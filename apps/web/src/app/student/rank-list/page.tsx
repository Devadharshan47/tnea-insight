'use client';

import { useState } from 'react';
import { Search, Trophy } from 'lucide-react';

const mockRankList = [
  { rank: 1, name: 'ARUN KUMAR R', applicationNo: 'TN2024001234', marks: 199.75, category: 'OC' },
  { rank: 2, name: 'PRIYA S', applicationNo: 'TN2024002345', marks: 199.50, category: 'OC' },
  { rank: 3, name: 'KARTHIK M', applicationNo: 'TN2024003456', marks: 199.25, category: 'BC' },
  { rank: 4, name: 'DIVYA L', applicationNo: 'TN2024004567', marks: 199.00, category: 'OC' },
  { rank: 5, name: 'RAJESH K', applicationNo: 'TN2024005678', marks: 198.75, category: 'MBC' },
  { rank: 1245, name: 'YOU (MOCK)', applicationNo: 'TN2024012450', marks: 185.50, category: 'OC' },
];

export default function RankListPage() {
  const [searchRank, setSearchRank] = useState('');
  const [filteredList, setFilteredList] = useState(mockRankList);

  const handleSearch = () => {
    if (searchRank) {
      const rank = parseInt(searchRank);
      setFilteredList(mockRankList.filter(item => item.rank === rank));
    } else {
      setFilteredList(mockRankList);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TNEA Rank List 2024</h1>
        <p className="text-gray-600">View official rank list and search your rank</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter rank to search..."
            value={searchRank}
            onChange={(e) => setSearchRank(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>
      </div>

      {/* Rank List Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredList.map((item, index) => (
                <tr key={index} className={item.rank === 1245 ? 'bg-indigo-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {item.rank <= 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      <span className="text-sm font-medium text-gray-900">{item.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.applicationNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a mock rank list for demonstration purposes. 
          Your actual rank (1245) is highlighted in the table. Download official rank list from TNEA portal.
        </p>
      </div>
    </div>
  );
}
