import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import 'bootstrap/dist/css/bootstrap.min.css';

// Lazy loading components
const CryptoHomePage = lazy(() => import('./Components/Homepage/CryptoHomePage'));
const CoinDetailsPage = lazy(() => import('./Components/CoinDetailsPage/CoinDetailsPage'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Define routes using "element" */}
          <Route path="/" element={<CryptoHomePage />} />
          <Route path="/coin/:coinId" element={<CoinDetailsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
