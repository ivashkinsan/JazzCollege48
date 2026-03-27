import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { navigation, collegeInfo, estradaDepartment, teachers, ensembles, concerts, news, achievements, graduates } from './data/collegeData';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Specialties from './components/Specialties';
import Teachers from './components/Teachers';
import Ensembles from './components/Ensembles';
import Achievements from './components/Achievements';
import Graduates from './components/Graduates';
import Concerts from './components/Concerts';
import News from './components/News';
import Admission from './components/Admission';
import Contacts from './components/Contacts';
import GraduatesPage from './pages/GraduatesPage';
import AdminPage from './pages/AdminPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import DaiPage from './pages/DaiPage';
import ScrollToHash from './components/ScrollToHash';

// Главная страница с секциями
function HomePage() {
  return (
    <>
      <Hero />
      <About department={estradaDepartment} />
      <Specialties department={estradaDepartment} />
      <Teachers teachers={teachers} />
      <Ensembles ensembles={ensembles} />
      <Achievements achievements={achievements} />
      <Graduates graduates={graduates} />
      <Concerts concerts={concerts} />
      <News news={news} />
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
            <Route path="/graduates" element={<GraduatesPage />} />
            <Route path="/dai" element={<DaiPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/videos" element={<VideosPage />} />
          </Routes>
        </main>
        <Footer navigation={navigation} />
      </div>
    </BrowserRouter>
  );
}

export default App;
