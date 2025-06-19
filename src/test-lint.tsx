// This is a test file to verify ESLint rules
import React, { useState, useEffect } from 'react';

// Missing React import (should be caught by ESLint)
function TestComponent(props) {
  // Using 'any' type (should trigger a warning)
  const [data, setData] = useState<any>(null);

  // Unused variable (should trigger a warning)
  const unusedVar = 'test';

  // Console.log (should trigger a warning)
  console.log('This is a test');

  // == instead of === (should trigger an error)
  if (props.value == null) {
    return null;
  }

  // Missing dependency in useEffect (should trigger a warning)
  useEffect(() => {
    if (props.value) {
      setData(props.value);
    }
  }, []);

  return (
    <div>
      {/* Missing alt attribute (should trigger an accessibility warning) */}
      <img src="test.jpg" />
      <p>{data}</p>
    </div>
  );
}

export default TestComponent;
