import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EligibilityPage from './pages/EligibilityPage';
import ComparisonPage from './pages/ComparisonPage';
import DocumentsPage from './pages/DocumentsPage';
import CostsPage from './pages/CostsPage';
import OutreachPage from './pages/OutreachPage';
import RisksPage from './pages/RisksPage';
import CommunityPage from './pages/CommunityPage';
import PricingPage from './pages/PricingPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/costs" element={<CostsPage />} />
          <Route path="/outreach" element={<OutreachPage />} />
          <Route path="/risks" element={<RisksPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
