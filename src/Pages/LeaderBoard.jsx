import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../Services/api";
import account from '../assets/account.png';
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  return (
    <div className="bg-[#2F3338] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4">
        <span className="font-sec text-white text-[50px]" onClick={() => navigate('/')}>Typo</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              src={account}
              alt="Account"
              className="w-10 h-10 cursor-pointer rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2F3338] border-gray-600 text-white w-40">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-[#3A3F45]"
              onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-[#3A3F45]"
              onClick={() => navigate('/account-details')}>
              Account Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 flex flex-col items-center ">
        <div className="w-full max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">
             Leaderboard
          </h2>
          
          <div className="bg-[#3A3F45] rounded-lg shadow-lg overflow-hidden">
            {leaderboard.length > 0 ? (
              <table className="w-full">
                <thead className="bg-[#2A2E32]">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Username</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">WPM</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr key={index} className="border-b border-[#444] hover:bg-[#444]">
                      <td className="px-6 py-4 text-white">{index + 1}</td>
                      <td className="px-6 py-4 text-white">{user.username}</td>
                      <td className="px-6 py-4 text-white">{user.wpm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-white p-6 text-center">No leaderboard data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;