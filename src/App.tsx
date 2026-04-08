import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { navigation, collegeInfo, estradaDepartment, teachers, ensembles, achievements, graduates, loadNews, ExtendedNewsItem } from './data/collegeData';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Specialties from './components/Specialties';
import Teachers from './components/Teachers';
import Ensembles from './components/Ensembles';
import Achievements from './components/Achievements';
import Graduates from './components/Graduates';
import ConcertsPreview from './components/ConcertsPreview';
import NewsPreview from './components/NewsPreview';
import Admission from './components/Admission';
import Contacts from './components/Contacts';
import GraduatesPage from './pages/GraduatesPage';
import AdminPage from './pages/AdminPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import DaiPage from './pages/DaiPage';
import NewsPage from './pages/NewsPage';
import AfishaPage from './pages/AfishaPage';
import ScrollToHash from './components/ScrollToHash';
import ScrollToTop from './components/ScrollToTop';

// Главная страница с секциями
function HomePage() {
  const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadNews().then((data) => {
      if (!cancelled) setNewsData(data);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Hero />
      <About department={estradaDepartment} />
      <Specialties department={estradaDepartment} />
      <Teachers teachers={teachers} />
      <Ensembles ensembles={ensembles} />
      <Achievements achievements={achievements} />
      <Graduates graduates={graduates} />
      <ConcertsPreview />
      <NewsPreview news={newsData} />
      <Admission collegeInfo={collegeInfo} />
      <Contacts collegeInfo={collegeInfo} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="app">
        <Header navigation={navigation} />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/afisha" element={<AfishaPage />} />
            <Route path="/graduates" element={<GraduatesPage />} />
            <Route path="/dai" element={<DaiPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/videos" element={<VideosPage />} />
          </Routes>
        </main>
        <Footer navigation={navigation} />
      </div>
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
