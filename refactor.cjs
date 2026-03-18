const fs = require('fs');
const path = require('path');

const pagesDir = './src/pages';
const pages = ['dashboard', 'analytics', 'logs', 'inventory', 'staff', 'orders', 'auth', 'landing'];

pages.forEach(page => {
  const filePath = path.join(pagesDir, page, 'index.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove imports
  content = content.replace(/import type \{ PageRoute \} from '@\/App';\n?/g, '');
  
  // Inject useNavigate import if navigating
  if (content.includes('onNavigate(') || content.includes('onNavigate')) {
    if (!content.includes('react-router-dom')) {
      content = "import { useNavigate } from 'react-router-dom';\n" + content;
    }
  }

  // Remove Props interface entirely
  content = content.replace(/interface \w+Props \{\n\s*onNavigate: \(page: PageRoute\) => void;\n\}\n?/g, '');

  // Replace component signature
  content = content.replace(/export default function (\w+)\(\{ onNavigate \}: \w+Props\) \{/g, 'export default function $1() {\n  const navigate = useNavigate();');

  // Replace onNavigate calls inside arrow functions or JSX
  content = content.replace(/onNavigate\('auth'\)/g, "navigate('/auth')");
  content = content.replace(/onNavigate\('landing'\)/g, "navigate('/')");
  content = content.replace(/onNavigate\('dashboard'\)/g, "navigate('/dashboard')");
  content = content.replace(/onNavigate\('orders'\)/g, "navigate('/orders')");
  content = content.replace(/onNavigate\('inventory'\)/g, "navigate('/inventory')");
  content = content.replace(/onNavigate\('staff'\)/g, "navigate('/staff')");
  content = content.replace(/onNavigate\('analytics'\)/g, "navigate('/analytics')");
  content = content.replace(/onNavigate\('logs'\)/g, "navigate('/logs')");

  // Fix Sidebar/Topbar prop passing. Since we won't pass currentPage and onNavigate
  content = content.replace(/<Sidebar currentPage="[^"]+" onNavigate=\{onNavigate\} \/>/g, '<Sidebar />');
  content = content.replace(/<Topbar onNavigate=\{onNavigate\} \/>/g, '<Topbar />');

  fs.writeFileSync(filePath, content);
});
console.log('Done refactoring components');
