import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './AppLayout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__wrapper">
        <Header />
        <main className="app-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}