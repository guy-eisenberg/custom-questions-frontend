import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomizations, postCustomization } from '../api';
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
import { useDispatch, useExam, useLoadingScreen } from '../hooks';
import { tempId } from '../lib';
import { setCustomization } from '../redux';
import { Customization } from '../types';

const CustomizationPage: React.FC = () => {
  const exam = useExam();

  const client = useQueryClient();

  const { isLoading: customizationsLoading, data: customizations } = useQuery(
    ['customizations'],
    () => getCustomizations(exam.id),
    {
      retry: 0,
      staleTime: Infinity,
    }
  );
  const {
    mutate: mutateCustomizations,
    isLoading: mutateCustomizationsLoading,
  } = useMutation(
    (customization: Customization) => postCustomization(customization),
    {
      onSuccess: () => client.invalidateQueries(['customizations']),
    }
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const [loadedCustomization, setLoadedCustomization] = useState<
    Customization | undefined
  >();

  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [questionQuantity, setQuestionQuantity] = useState('');
  const [coPilotActivated, setCoPilotActivated] = useState(true);

  const [disabledCateogiresIds, setDisabledCateogriesIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (loadedCustomization !== undefined)
      return () => setLoadedCustomization(undefined);
  }, [
    loadedCustomization,
    minutes,
    seconds,
    questionQuantity,
    coPilotActivated,
    disabledCateogiresIds,
  ]);

  useLoadingScreen(customizationsLoading || mutateCustomizationsLoading);

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
                    <NumberInput
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                    <span>minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                    />
                    <span>seconds</span>
                  </div>
                </div>
              </LabeledBox>
              <LabeledBox label="No. of Questions">
                <p className="mb-[2vh]">
                  Set the maximum quantity of questions:
                </p>
                <NumberInput
                  className="w-20"
                  value={questionQuantity}
                  onChange={(e) => setQuestionQuantity(e.target.value)}
                />
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
                    disabledCateogiresIds={disabledCateogiresIds}
                    setDisabledCateogriesIds={setDisabledCateogriesIds}
                    categories={exam.categories}
                  />
                </div>
              </LabeledBox>
              <div className="flex gap-3 lg:justify-end">
                <Button
                  disabled={!customizations || customizations.length === 0}
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

                    if (loadedCustomization) {
                      dispatch(
                        setCustomization(
                          _.omit(loadedCustomization, 'time_added')
                        )
                      );

                      navigate(`/${exam.id}/run`, { replace: true });
                    } else setSaveModalOpen(true);
                  }}
                  disabled={
                    minutes.length === 0 ||
                    seconds.length === 0 ||
                    questionQuantity.length === 0
                  }
                >
                  {loadedCustomization ? 'Launch' : 'Save & Launch'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Button
          color="gray"
          className="absolute top-[2vh] left-[1vw] hidden items-center gap-4 !text-theme-medium-gray lg:flex"
          onClick={() => navigate(`/${exam.id}`, { replace: true })}
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
        customizations={customizations || []}
        visible={loadModalOpen}
        hideModal={() => setLoadModalOpen(false)}
        load={(i) => {
          if (!customizations || customizations.length === 0) return;

          const customization = customizations[i];

          setMinutes(`${Math.floor(customization.duration / 60)}`);
          setSeconds(`${customization.duration % 60}`);
          setQuestionQuantity(`${customization.question_quantity}`);
          setCoPilotActivated(customization.copilot_activated);
          setDisabledCateogriesIds(customization.disabled_categories);

          setLoadedCustomization(customization);
          setLoadModalOpen(false);
        }}
      />
      <SaveModal
        className="mx-[2vw] w-full !max-w-2xl"
        save={(name) => {
          const newCustomization = {
            id: tempId(),
            exam_id: exam.id,
            name,
            time_added: new Date(),
            duration: parseInt(minutes) * 60 + parseInt(seconds),
            question_quantity: parseInt(questionQuantity),
            copilot_activated: coPilotActivated,
            disabled_categories: disabledCateogiresIds,
          };

          mutateCustomizations(newCustomization);

          dispatch(setCustomization(_.omit(newCustomization, 'time_added')));
          navigate(`/${exam.id}/run`, { replace: true });
        }}
        visible={saveModalOpen}
        hideModal={() => setSaveModalOpen(false)}
      />
    </main>
  );
};

export default CustomizationPage;
