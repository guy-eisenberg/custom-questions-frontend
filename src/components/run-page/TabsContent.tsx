import { useState } from 'react';
import { c } from '../../lib';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: { tab: string; content: string }[];
}

const TabsContent: React.FC<TabsContentProps> = ({ tabs, ...rest }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="text-sm">
      <div className="flex gap-2">
        {tabs.map((tab, i) => (
          <button
            className={c(
              'relative rounded-t-md border border-b-0 border-theme-light-gray bg-theme-light-gray py-2 px-4',
              selectedTabIndex === i ? 'top-[1px] z-10 !bg-white' : 'top-2'
            )}
            onClick={() => setSelectedTabIndex(i)}
            key={i}
          >
            {tab.tab}
          </button>
        ))}
      </div>
      <div className="relative flex flex-col gap-4 rounded-md rounded-tl-none border border-theme-light-gray bg-white p-2">
        <p>{tabs[selectedTabIndex].content}</p>
      </div>
    </div>
  );
};

export default TabsContent;
