import { Route, Routes } from 'react-router-dom';
import { FeedbackTab, Navbar, OverviewTab, Tabbar } from '../components';

const CompletePage: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar className="h-14" minified />
      <Tabbar className="h-12" />
      <div className="flex flex-1 items-center justify-center">
        <Routes>
          <Route path="overview" element={<OverviewTab />} />
          <Route path="feedback" element={<FeedbackTab />} />
        </Routes>
      </div>
    </main>
  );
};

export default CompletePage;
