import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PollCreator from './components/PollCreator';
import DeploymentFlow from './components/DeploymentFlow';
import PollView from './components/PollView';
import { PollProvider } from './context/PollContext';

function App() {
  return (
    <PollProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-800">
          <Header />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<PollCreator />} />
              <Route path="/deploy/:pollId" element={<DeploymentFlow />} />
              <Route path="/poll/:pollId" element={<PollView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PollProvider>
  );
}

export default App;