import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { loadNews, loadGraduates } from './data';
import { loadAchievements } from './data/achievementsLoader';
import { navigation, collegeInfo, estradaDepartment, teachers } from './data/static';
import type { ExtendedNewsItem, Graduate } from './types/college';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Specialties from './components/Specialties';
import Teachers from './components/Teachers';
import AchievementsPreview from './components/AchievementsPreview';
import Graduates from './components/Graduates';
import ConcertsPreview from './components/ConcertsPreview';
import NewsPreview from './components/NewsPreview';
import Admission from './components/Admission';
import Contacts from './components/Contacts';
import GraduatesPage from './pages/GraduatesPage';
import AdminPage from './pages/AdminPage';
import VideosPage from './pages/VideosPage';
import VideosPage2 from './pages/VideosPage2';
import DaiPage from './pages/DaiPage';
import DepartmentPage from './pages/DepartmentPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewsPage from './pages/NewsPage';
import AfishaPage from './pages/AfishaPage';
import LibraryPage from './pages/LibraryPage';
import AchievementsPage from './pages/AchievementsPage';
import ScrollToHash from './components/ScrollToHash';
import ScrollToTop from './components/ScrollToTop';

const baseName = import.meta.env.BASE_URL;

// Главная страница с секциями
function HomePage() {
  const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);
  const [achievementsData, setAchievementsData] = useState<any[]>([]);
  const [graduatesData, setGraduatesData] = useState<Graduate[]>([]);

  useEffect(() => {
    let cancelled = false;
    
    // Load News
    loadNews().then((data) => {
      if (!cancelled) setNewsData(data);
    });

    // Load Achievements
    loadAchievements().then((data) => {
      if (!cancelled) setAchievementsData(data);
    });

    // Load Graduates
    loadGraduates().then((data) => {
      if (!cancelled) setGraduatesData(data);
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Hero />
      <About department={estradaDepartment} />
      <Specialties department={estradaDepartment} />
      <Teachers teachers={teachers} />
      <AchievementsPreview achievements={achievementsData} />
      <Graduates graduates={graduatesData} />
      <ConcertsPreview />
      <NewsPreview news={newsData} />
      <Admission collegeInfo={collegeInfo} />
      <Contacts collegeInfo={collegeInfo} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={baseName}>
      <ScrollToHash />
      <div className="app">
        <Header navigation={navigation} />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/afisha" element={<AfishaPage />} />
            <Route path="/graduates" element={<GraduatesPage />} />
            <Route path="/dai" element={<DaiPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos2" element={<VideosPage2 />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </main>
        <Footer navigation={navigation} />
      </div>
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
