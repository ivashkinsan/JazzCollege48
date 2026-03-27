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
      <div className="app">
        <Header navigation={navigation} />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/graduates" element={<GraduatesPage />} />
          </Routes>
        </main>
        <Footer navigation={navigation} />
      </div>
    </BrowserRouter>
  );
}

export default App;
