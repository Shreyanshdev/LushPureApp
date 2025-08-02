// app/index.tsx

// This file acts as the entry point for the '/' route.
// It explicitly defines a functional component that renders your main HomeScreen component.

import React from 'react'; // Import React for component definition
import HomeScreen from './screens/HomeScreen'; // Adjust path if your src/screens is deeper

// Define a functional component for this route
const AppIndex = () => {
  return <HomeScreen />;
};

// Export the functional component as the default export for this route
export default AppIndex;
