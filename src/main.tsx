
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);

// For Firebase auth session persistence and development tools
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
}
