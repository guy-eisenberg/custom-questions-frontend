import { useMatch } from 'react-router-dom';

function useParams() {
  const baseMatch = useMatch('/:examId');
  const match = useMatch('/:examId/:page');
  const completeMatch = useMatch('/:examId/:page/:tab');

  if (!baseMatch?.params && !match?.params && !completeMatch?.params)
    throw new Error('Invalid URL.');

  return (completeMatch || match || baseMatch)?.params as {
    examId: string;
    page: string;
    tab: 'overview' | 'feedback';
  };
}

export default useParams;
