import { api } from '../clients';
import type {
  Answer,
  Category,
  DBAnswer,
  DBCategory,
  DBExam,
  DBQuestion,
  Exam,
  Question,
} from '../types';

async function getExam(examId: string): Promise<Exam> {
  try {
    const { data } = await api.get<DBExam>(`/exams.php?id=${examId}`);

    return {
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
      categories: parseDBCategories(data.categories),
    };
  } catch (err) {
    return Promise.reject(err);
  }
}
export default getExam;

function parseDBCategories(categories: DBCategory[]) {
  return categories.map(parseDBCategory);

  function parseDBCategory(category: DBCategory): Category {
    return {
      ...category,
      parent_category_id: category.parent_category_id || undefined,
      sub_categories: category.sub_categories.map(parseDBCategory),
      questions: category.questions.map(parseDBQuestion),
    };
  }

  function parseDBQuestion(question: DBQuestion): Question {
    return {
      ...question,
      answers: question.answers.map(parseDBAnswer),
    };
  }

  function parseDBAnswer(answer: DBAnswer): Answer {
    return {
      ...answer,
      is_right: answer.is_right === '1',
    };
  }
}
