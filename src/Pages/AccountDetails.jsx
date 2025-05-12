import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import axios from 'axios';
import account from '../assets/account.png';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AccountDetails() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [wpm, setWpm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController(); // Create abort controller
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://typo-se.onrender.com/auth/me', {
          withCredentials: true,
          signal: controller.signal, // Add abort signal
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data) {
          setUsername(response.data.username);
          setOriginalUsername(response.data.username);
          setEmail(response.data.email);
          setWpm(response.data.wpm || 0);
        }
      } catch (err) {
        if (err.name === 'CanceledError' || axios.isCancel(err)) {
          return;
        }
        
        if (err.response?.status === 401) {
          navigate('/sign-login');
        } else {
          setError(err.response?.data?.message || 
                  err.message || 
                  'Failed to load user data');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
  
    fetchUserData();
    
    return () => controller.abort();
  }, [navigate]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        'https://typo-se.onrender.com/auth/update-username',
        { username },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        setIsEditing(false);
        setOriginalUsername(username);
        alert('Username updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update username');
      
      if (err.response?.status === 401) {
        navigate('/sign-login');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://typo-se.onrender.com/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      navigate('/', { replace: true });
      window.location.reload(); 
      
    } catch (err) {
      console.error('Logout error:', err);
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      navigate('/', { replace: true });
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  return (
    <div className="bg-[#2F3338] min-h-screen">
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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-4xl font-sec text-white text-center mb-8">Account Details</h1>
        
        <div className="bg-[#3A3F45] rounded-lg p-8 shadow-xl">
          {/* Username Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-white text-lg">Username</Label>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            
            {isEditing ? (
              <div className="flex gap-4">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#2F3338] text-white flex-1"
                  autoFocus
                />
                <Button 
                  onClick={handleUpdateUsername}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="text-white text-xl py-2 px-4 bg-[#2F3338] rounded">
                {originalUsername}
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="mb-6">
            <Label className="text-white text-lg">Email</Label>
            <div className="text-gray-400 text-xl py-2 px-4 bg-[#2F3338] rounded">
              {email}
            </div>
          </div>

          {/* WPM Section */}
          <div className="mb-8">
            <Label className="text-white text-lg">High Score (WPM)</Label>
            <div className="text-white text-xl py-2 px-4 bg-[#2F3338] rounded">
              {wpm}
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            className="w-full bg-black text-white hover:bg-gray-800 mt-6 font-sec"
          >
            Logout
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-4 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}