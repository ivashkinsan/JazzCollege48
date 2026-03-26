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
import './App.css';

function App() {
  return (
    <div className="app">
      <Header shortName={collegeInfo.shortName} navigation={navigation} />
      <main className="main">
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
      </main>
      <Footer shortName={collegeInfo.shortName} navigation={navigation} />
    </div>
  );
}

export default App;
