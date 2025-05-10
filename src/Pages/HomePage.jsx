import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from "../Components/navbar";
import account from '../assets/account.png';
import { fetchText, updateUserWPM } from '../Services/api.js';
import AccountMenu from '@/Components/AccountMenu';
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function HomePage() {
  const [text, setText] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState(new Set());
  const [typedIndices, setTypedIndices] = useState(new Set());
  const [timer, setTimer] = useState(15);
  const [wpm, setWpm] = useState(0);
  const [isOptionsLocked, setIsOptionsLocked] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [options, setOptions] = useState({ 
    time: '15', 
    type: 'words', 
    difficulty: 'easy' 
  });
  const [typingStart, setTypingStart] = useState(null);
  const [hasTextLoaded, setHasTextLoaded] = useState(false);
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineGroup, setCurrentLineGroup] = useState(0);

  const timerRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  const typingStartRef = useRef(typingStart);
  const textLinesRef = useRef([]);
  const visibleTextRef = useRef('');
  const navigate = useNavigate();

  useEffect(() => {
    const optionsTimer = setTimeout(async () => {
      setIsOptionsLocked(true);
      try {
        const newText = await fetchText(options);
        if (newText) {
          setText(newText);
          textLinesRef.current = newText.split('\n').filter(line => line.trim().length > 0);
          updateVisibleLines(0);
          setHasTextLoaded(true);
          setTimer(parseInt(options.time));
        }
      } catch (error) {
        console.error("Error loading text:", error);
        setText('Error loading text. Please try again.');
      }
    }, 4000);
    return () => clearTimeout(optionsTimer);
  }, [options]);

  const updateVisibleLines = (groupIndex) => {
    const start = groupIndex * 3;
    const end = start + 3;
    const newVisibleLines = textLinesRef.current.slice(start, end);
    setVisibleLines(newVisibleLines);
    visibleTextRef.current = newVisibleLines.join('\n');
  };

  useEffect(() => {
    if (!hasTextLoaded || isTestComplete) return;
    
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTestComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [hasTextLoaded, isTestComplete]);

  useEffect(() => {
    if (isTestComplete && typingStartRef.current) {
      const minutes = (performance.now() - typingStartRef.current) / 60000;
      const correctChars = currentIndexRef.current - errorIndices.size;
      const calculatedWpm = Math.round((correctChars / 5) / minutes);
      setWpm(calculatedWpm);
  
      updateUserWPM(calculatedWpm)
        .then(() => console.log("WPM updated successfully"))
        .catch((err) => console.error("Failed to update WPM", err));
    }
  }, [isTestComplete, errorIndices.size]);

  const handleKeyPress = useCallback((e) => {
    if (!isOptionsLocked || !hasTextLoaded || timer === 0 || isTestComplete) return;
    if (e.key.length > 1 && !['Backspace', 'Enter', ' '].includes(e.key)) return;

    if (!typingStartRef.current) {
      typingStartRef.current = performance.now();
      setTypingStart(typingStartRef.current);
    }

    const currentCharIndex = currentIndexRef.current;
    const currentChar = visibleTextRef.current[currentCharIndex];

    if (e.key === 'Backspace') {
      if (currentCharIndex > 0) {
        currentIndexRef.current -= 1;
        setCurrentIndex(currentIndexRef.current);
        
        setTypedIndices(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentCharIndex - 1);
          return newSet;
        });
        
        setErrorIndices(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentCharIndex - 1);
          return newSet;
        });
      }
      return;
    }

    setTypedIndices(prev => new Set(prev).add(currentCharIndex));

    const isCorrect = e.key === currentChar;
    setErrorIndices(prev => {
      const newSet = new Set(prev);
      isCorrect ? newSet.delete(currentCharIndex) : newSet.add(currentCharIndex);
      return newSet;
    });

    currentIndexRef.current += 1;
    setCurrentIndex(currentIndexRef.current);

    if (currentIndexRef.current >= visibleTextRef.current.length) {
      const nextGroup = currentLineGroup + 1;
      if (nextGroup * 3 < textLinesRef.current.length) {
        setTypedIndices(new Set());
        setErrorIndices(new Set());
        
        setCurrentLineGroup(nextGroup);
        updateVisibleLines(nextGroup);
        currentIndexRef.current = 0;
        setCurrentIndex(0);
      }
    }
  }, [text, isOptionsLocked, hasTextLoaded, timer, isTestComplete, currentLineGroup]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="bg-[#2F3338] h-screen w-screen">
      <span className="font-sec ml-[30px] pt-[10px] text-white text-[50px]"  onClick={() => navigate('/')}>Typo</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            src={account}
            alt="Account"
            className="absolute top-[30px] right-[40px] w-10 h-10 cursor-pointer rounded-full"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" bg-[#2F3338] outline-none border-[1px] white text-white w-40">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={() => navigate('/account-details')}>
            Account Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Navbar 
        onSelect={setOptions} 
        selectedOptions={options} 
        disabled={isOptionsLocked}
      />

      {!isTestComplete ? (
        <div className="text-white/40 absolute top-[35%] left-[10%] w-[1090px] text-[27px]">
          <p>
            {visibleTextRef.current.split('').map((char, index) => {
              const isTyped = typedIndices.has(index);
              const isError = errorIndices.has(index);
              return (
                <span
                  key={index}
                  style={{
                    opacity: isTyped ? 1 : 0.4,
                    color: isError ? '#ff4444' : '#ffffff',
                    transition: 'all 0.1s ease'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </p>
        </div>
      ) : (
        <div className="text-white text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
          Test Complete! Your WPM: {wpm}
        </div>
      )}

      <div className="text-[40px] absolute top-[90%] left-[45%]">
        <span className="text-white">
          Time: {timer}s 
        </span>
      </div>
    </div>
  );
}

export default HomePage;
