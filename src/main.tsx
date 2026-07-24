import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OverviewPage } from './pages/OverviewPage'
import { PoetPage } from './pages/PoetPage'
import './themes/base.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/poets" element={<OverviewPage />} />
        <Route path="/poets/:dynasty/:poetId" element={<PoetPage />} />
        <Route path="*" element={<Navigate to="/poets" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
