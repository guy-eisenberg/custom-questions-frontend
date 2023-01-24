import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../clients';
import {
  CompleteExitModal,
  CompleteRestartModal,
  FeedbackTab,
  Navbar,
  OverviewTab,
  Tabbar,
} from '../components';
import { useDispatch, useExam, useLoadingScreen, useSelector } from '../hooks';
import { resetExam } from '../redux';

const CompletePage: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const exam = useExam();
  const {
    mode,
    score: _score,
    customization,
    time,
    trainingMode,
  } = useSelector((state) => state.exam);

  const [tab, setTab] = useState<'overview' | 'feedback'>('overview');

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);

  const { isLoading: insertResultLoading, mutate: insertResult } =
    useMutation(_insertResult);

  const [usersResults, setUsersResults] = useState<
    { average_score: number } | undefined
  >(undefined);
  const [usersResultsLoading, setUsersResultsLoading] = useState(true);

  const questionQuantity =
    mode === 'customization' && customization
      ? customization.question_quantity
      : exam.question_quantity;

  const score = Math.round((_score / questionQuantity) * 100);

  useEffect(() => {
    if (mode !== 'customization' && exam.id !== 'custom') {
      insertResult({
        score,
        duration: time,
        mode: trainingMode ? 'training' : 'normal',
      });

      getUsersResults()
        .then((res) => setUsersResults(res))
        .finally(() => setUsersResultsLoading(false));
    }
  }, [insertResult, exam.id, score, time, mode, trainingMode]);

  useLoadingScreen(insertResultLoading || usersResultsLoading);

  return (
    <>
      <main className="flex flex-1 flex-col">
        <Navbar
          className="h-14"
          minified
          endButtons
          showExitModal={() => setExitModalOpen(true)}
          showRestartModal={() => setRestartModalOpen(true)}
        />

        {/* NOTE: Desktop */}

        <Tabbar
          tab={tab}
          setTab={setTab}
          className="hidden h-12 shadow-md shadow-black/10 md:flex"
        />
        <div className="hidden flex-1 flex-col items-center md:flex md:justify-center">
          {tab === 'overview' ? (
            <OverviewTab score={score} usersResults={usersResults} />
          ) : (
            <FeedbackTab />
          )}
        </div>

        {/* NOTE: Mobile */}
        <div className="relative md:hidden">
          <OverviewTab score={score} usersResults={usersResults} />
          <FeedbackTab />
        </div>
      </main>
      <CompleteExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate(`/${exam.id}`)}
      />
      <CompleteRestartModal
        visible={restartModalOpen}
        hideModal={() => setRestartModalOpen(false)}
        restart={restartTest}
      />
    </>
  );

  async function getUsersResults() {
    try {
      const { data } = await api.get<{ average_score: number }>(
        '../get-users-results.php'
      );

      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async function _insertResult(data: {
    score: number;
    duration: number;
    mode: string;
  }) {
    try {
      return await api.post('../insert-result.php', data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function restartTest() {
    dispatch(resetExam());

    navigate(`/${exam.id}/run`, { replace: true });
  }
};

export default CompletePage;
