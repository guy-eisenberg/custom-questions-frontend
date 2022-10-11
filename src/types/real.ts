export interface DBExam {
  id: string;
  name: string;
  question_quantity: string;
  show_results: string;
  template_type:
    | 'side-by-side-small'
    | 'side-by-side-medium'
    | 'side-by-side-big';
  allow_copilot: string;
  customization_mode: string;
  training_mode: string;
  flag_questions: string;
  exam_builder: string;
  duration: string;
  question_duration: string;
  allow_user_navigation: string;
  strong_pass: string;
  weak_pass: string;
  question_map: string;
  skill_categories: SkillCategory[];
  categories: Category[];
}

export interface Exam {
  id: string;
  name: string;
  question_quantity: number;
  show_results: boolean;
  template_type:
    | 'side-by-side-small'
    | 'side-by-side-medium'
    | 'side-by-side-big';
  allow_copilot: boolean;
  customization_mode: boolean;
  training_mode: boolean;
  flag_questions: boolean;
  exam_builder: boolean;
  duration: number;
  question_duration: number;
  allow_user_navigation: boolean;
  strong_pass: number;
  weak_pass: number;
  question_map: boolean;
  skill_categories: SkillCategory[];
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  sub_categories: Category[];
  questions: Question[];
}

export interface Question {
  id: string;
  body: string;
  explanation: string;
  featured_image: string;
  answers: Answer[];
  informations: Information[];
}

export interface Answer {
  id: string;
  body: string;
  is_right: boolean;
}

export interface Information {
  id: string;
  name: string;
  type: 'hyperlink' | 'image' | 'pdf';
}

export interface SkillCategory {
  id: string;
  name: string;
}
