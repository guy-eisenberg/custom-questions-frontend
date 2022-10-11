import { useQuery } from '@tanstack/react-query';
import { getExam } from '../api';
import { Exam } from '../types/real';
import useParams from './useParams';

function useExam() {
  const { examId } = useParams();

  const { status, data, error } = useQuery(['exam'], () => getExam(examId), {
    retry: 0,
    staleTime: Infinity,
  });

  return {
    status,
    exam:
      data &&
      ({
        ...data,
        allow_copilot: data.allow_copilot === '1',
        allow_user_navigation: data.allow_user_navigation === '1',
        customization_mode: data.customization_mode === '1',
        duration: parseInt(data.duration),
        exam_builder: data.exam_builder === '1',
        flag_questions: data.flag_questions === '1',
        question_duration: parseInt(data.question_duration),
        question_map: data.question_map === '1',
        question_quantity: parseInt(data.question_quantity),
        show_results: data.show_results === '1',
        strong_pass: parseInt(data.strong_pass),
        training_mode: data.training_mode === '1',
        weak_pass: parseInt(data.weak_pass),
      } as Exam),
    error,
  };
}

export default useExam;
