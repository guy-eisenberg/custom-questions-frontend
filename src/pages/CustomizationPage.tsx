import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CategoriesBox,
  LabeledBox,
  LoadModal,
  Navbar,
  NumberInput,
  SaveModal,
  ToggleButton,
} from '../components';
import { useParams } from '../hooks';
import { Category, Customization } from '../types';

const CustomizationPage: React.FC = () => {
  const { examId: activityId } = useParams();

  const navigate = useNavigate();

  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const [coPilotActivated, setCoPilotActivated] = useState(true);

  return (
    <main className="flex flex-1 flex-col">
      <Navbar className="h-14" minified mobileBackButton />
      <div className="relative lg:flex lg:flex-1 lg:items-center lg:justify-center">
        <div className="w-full max-w-7xl bg-white p-8 lg:rounded-md lg:border lg:border-theme-light-gray lg:py-4">
          <div className="flex justify-between">
            <span className="text-small-title font-semibold text-theme-dark-gray">
              New Customization
            </span>
            <Button className="hidden items-center gap-2 lg:flex" color="gray">
              Get help with Exam Customization{' '}
              <img alt="help icon" src="images/icon_help.svg" className="h-5" />
            </Button>
          </div>
          <p className="my-[3vh] text-sm text-theme-medium-gray">
            Modify the settings below to customise the duration, quantity of
            questions and the questions displayed to you within your exam.
          </p>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-8">
              <LabeledBox label="Exam Duration">
                <p className="mb-[2vh]">
                  Set the length of the examination, in minutes and seconds:
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <NumberInput />
                    <span>minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput />
                    <span>seconds</span>
                  </div>
                </div>
              </LabeledBox>
              <LabeledBox label="No. of Questions">
                <p className="mb-[2vh]">
                  Set the maximum quantity of questions:
                </p>
                <NumberInput className="w-20" />
              </LabeledBox>
              <LabeledBox label="CoPilot Mode">
                <div className="flex gap-2">
                  <p className="leading-8">
                    Enable or disable CoPilot Mode to enable adjustment of
                    question category weighting, enabling you to focus on
                    particular area of weakness.
                  </p>
                  <div>
                    <ToggleButton
                      className="mt-[1vh] !w-[80px] border border-theme-light-gray bg-[#f9f9f9] after:w-[35px] after:!bg-theme-blue"
                      color="blue"
                      isChecked={coPilotActivated}
                      onToggle={setCoPilotActivated}
                      textColor="#c6c6c6"
                      upperCase
                    />
                  </div>
                </div>
              </LabeledBox>
            </div>
            <div className="flex flex-1 flex-col gap-8">
              <LabeledBox className="flex-1" label="Question Categories">
                <div className="flex h-full flex-col">
                  <p className="mb-[2vh]">
                    Select the question categories to appear within your
                    examination:
                  </p>
                  <CategoriesBox
                    className="w-full flex-1 overflow-y-auto lg:w-3/4 lg:basis-0"
                    categories={DUMMY_CATEGORIES}
                  />
                </div>
              </LabeledBox>
              <div className="flex gap-3 lg:justify-end">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();

                    setLoadModalOpen(true);
                  }}
                >
                  Load Customization
                </Button>
                <Button
                  color="green"
                  onClick={(e) => {
                    e.stopPropagation();

                    setSaveModalOpen(true);
                  }}
                >
                  Save & Launch
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Button
          color="gray"
          className="absolute top-[2vh] left-[1vw] hidden items-center gap-4 !text-theme-medium-gray lg:flex"
          onClick={() => navigate(`/${activityId}`, { replace: true })}
        >
          <img
            alt="arrow icon"
            src="images/icon_arrow.svg"
            className="h-2 opacity-60"
          />
          Return to Main Menu
        </Button>
      </div>
      <LoadModal
        className="mx-[2vw] w-full !max-w-2xl"
        customizations={DUMMY_CUSTOMIZATINOS}
        visible={loadModalOpen}
        hideModal={() => setLoadModalOpen(false)}
        load={() => {
          setLoadModalOpen(false);
        }}
      />
      <SaveModal
        className="mx-[2vw] w-full !max-w-2xl"
        save={() => {
          setSaveModalOpen(false);
        }}
        visible={saveModalOpen}
        hideModal={() => setSaveModalOpen(false)}
      />
    </main>
  );
};

export default CustomizationPage;

const DUMMY_CATEGORIES: Category[] = [
  {
    id: '0',
    name: 'Category A',
    sub_categories: [
      { id: '1', name: 'Sub-Category 1', sub_categories: [] },
      { id: '2', name: 'Sub-Category 2', sub_categories: [] },
      { id: '3', name: 'Sub-Category 3', sub_categories: [] },
    ],
  },
  {
    id: '4',
    name: 'Category B',
    sub_categories: [],
  },
  {
    id: '5',
    name: 'Category C',
    sub_categories: [],
  },
  {
    id: '6',
    name: 'Category D',
    sub_categories: [],
  },
  {
    id: '7',
    name: 'Category E',
    sub_categories: [],
  },
  {
    id: '8',
    name: 'Category F',
    sub_categories: [
      { id: '9', name: 'Sub-Category 1', sub_categories: [] },
      { id: '10', name: 'Sub-Category 2', sub_categories: [] },
      { id: '11', name: 'Sub-Category 3', sub_categories: [] },
    ],
  },
  {
    id: '12',
    name: 'Category G',
    sub_categories: [],
  },
  {
    id: '13',
    name: 'Category H',
    sub_categories: [],
  },
  {
    id: '14',
    name: 'Category I',
    sub_categories: [],
  },
  {
    id: '15',
    name: 'Category J',
    sub_categories: [],
  },
  {
    id: '16',
    name: 'Category K',
    sub_categories: [],
  },
];

const DUMMY_CUSTOMIZATINOS: Customization[] = new Array(5)
  .fill(null)
  .map((_, i) => ({
    id: `${i}`,
    name: 'Name Goes Here',
    date: '13:47 on 01/01/1973',
  }));
