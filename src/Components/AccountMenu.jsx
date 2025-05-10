import { useState } from "react";
import account from "../assets/account.png"; // adjust the path as needed

export default function AccountMenu() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="absolute top-[30px] right-[40px]">
      <img
        src={account}
        alt="Account"
        className="h-10 w-10 cursor-pointer"
        onClick={() => setShowMenu(prev => !prev)}
      />
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg text-black z-10">
          <a href="/leaderboard" className="block px-4 py-2 hover:bg-gray-100">Leaderboard</a>
          <a href="/account" className="block px-4 py-2 hover:bg-gray-100">Account Details</a>
          <a href="/login" className="block px-4 py-2 hover:bg-gray-100">Login / Sign Up</a>
        </div>
      )}
    </div>
  );
}
