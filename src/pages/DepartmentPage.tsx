import { ensembles } from '../data/staticData';
import Orchestra from '../components/Orchestra';

const orchestraData = ensembles.find(e => e.type === 'Оркестр');

function DepartmentPage() {
  if (!orchestraData) {
    return <div>Оркестр не найден</div>;
  }
  return <Orchestra ensemble={orchestraData} />;
}

export default DepartmentPage;
