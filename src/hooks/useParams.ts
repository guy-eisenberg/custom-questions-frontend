import { useMatch } from 'react-router-dom';

function useParams() {
  const baseMatch = useMatch('/:examId');
  const match = useMatch('/:examId/:page');

  if (!baseMatch?.params && !match?.params) throw new Error('Invalid URL.');

  return (match || baseMatch)?.params as {
    examId: string;
    page: string;
  };
}

export default useParams;
