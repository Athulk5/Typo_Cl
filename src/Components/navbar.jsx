/* function Navbar() {
    return (
      <div className="bg-[#3A3D3F] rounded-[4px] text-white absolute left-[10%] top-[20%] flex flex-row w-[80%] h-[5%] items-center justify-between px-[2%]">
        <span className="text-[20px] font-sec">15</span>
        <span className="text-[20px] font-sec">60</span>
        <span className="text-[20px] font-sec">120</span>
        <span>|</span>
        <span className="text-[20px] font-sec">Words</span>
        <span className="text-[20px] font-sec">Quotes</span>
        <span className="text-[20px] font-sec">Number</span>
        <span>|</span>
        <span className="text-[20px] font-sec">Easy</span>
        <span className="text-[20px] font-sec">Normal</span>
        <span className="text-[20px] font-sec">Hard</span>
      </div>
    );
  }
  
  export default Navbar; */
  // Navbar.jsx
// Add this import at the top

import React from 'react';

function Navbar({ onSelect, disabled, selectedOptions = {} }) {
  // Add the optionsConfig definition here
  const optionsConfig = [
    {
      group: 'time',
      items: ['15', '60', '120']
    },
    {
      group: 'type',
      items: ['words', 'quotes', 'numbers']
    },
    {
      group: 'difficulty',
      items: ['easy', 'normal', 'hard']
    }
  ];

  const handleOptionClick = (group, value) => {
    if (!disabled) {
      onSelect(prev => ({
        ...prev,
        [group]: value
      }));
    }
  };

  return (
    <div className="bg-[#3A3D3F] rounded-[4px] text-white absolute left-[10%] top-[20%] flex flex-row w-[80%] h-[5%] items-center justify-between px-[2%]">
      {optionsConfig.map((config, index) => (
        <React.Fragment key={config.group}>
          {config.items.map((item) => (
            <button
              key={item}
              className={`text-[20px] font-sec transition-all duration-200 
                ${selectedOptions[config.group] === item 
                  ? 'text-white brightness-125 scale-110' 
                  : 'text-gray-400 hover:brightness-110 hover:scale-103'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleOptionClick(config.group, item)}
              disabled={disabled}
            >
              {item}
            </button>
          ))}
          {index < optionsConfig.length - 1 && <span>|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Navbar;