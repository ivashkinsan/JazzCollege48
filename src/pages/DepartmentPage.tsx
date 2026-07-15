import React from 'react';

function DepartmentPage() {
  return (
    <div style={{ padding: 'var(--header-height) 20px', textAlign: 'center' }}>
      <h1>Отделение</h1>
      <p>Информация об отделении будет добавлена здесь.</p>
      <p>Информация об оркестре теперь доступна на <a href="/orchestra">отдельной странице оркестра</a>.</p>
    </div>
  );
}

export default DepartmentPage;
