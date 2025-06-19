// This is a test file to verify Prettier formatting
import React, { useState } from 'react';

// Inconsistent quotes, extra spaces, and long line
const TestPrettierComponent = ({ title, description, items }) => {
  // Inconsistent indentation (4 spaces instead of 2)
  const [isOpen, setIsOpen] = useState(false);

  // Long line that should be wrapped
  const longText =
    'This is a very long text that should be wrapped by Prettier because it exceeds the print width limit of 100 characters that we set in the configuration';

  // Missing indentation
  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="container">
      <h1 className={'title ' + (isOpen ? 'open' : 'closed')}>{title}</h1>
      {isOpen && (
        <div>
          <p>{description}</p>
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleClick}>{isOpen ? 'Close' : 'Open'}</button>
    </div>
  );
};

export default TestPrettierComponent;
