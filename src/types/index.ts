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
  // skill_categories: SkillCategory[];
  categories: DBCategory[];
  custom_content?: {
    id: string;
    type: ExamCustomContentType;
    content: any;
  };
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
  strong_pass?: number;
  weak_pass?: number;
  question_map: boolean;
  // skill_categories: SkillCategory[];
  categories: Category[];
  custom_content?: {
    id: string;
    type: ExamCustomContentType;
    content: any;
  };
}

export type ExamCustomContentType = 'text' | 'image' | 'tabs';

export interface DBCategory {
  id: string;
  name: string;
  parent_category_id: string | null;
  sub_categories: DBCategory[];
  questions: DBQuestion[];
}

export interface Category {
  id: string;
  name: string;
  parent_category_id?: string;
  sub_categories: Category[];
  questions: Question[];
}

export interface DBQuestion {
  id: string;
  body: string;
  category_id: string;
  explanation: string;
  featured_image: string;
  answers: DBAnswer[];
  informations: Information[];
}

export interface Question {
  id: string;
  body: string;
  category_id: string;
  explanation: string;
  featured_image?: string;
  answers: Answer[];
  informations: Information[];
}

export interface DBAnswer {
  id: string;
  body: string;
  is_right: string;
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
  hyperlink: string;
}

export interface DBCustomization {
  id: string;
  exam_id: string;
  name: string;
  time_added: string;
  duration: string;
  question_quantity: string;
  copilot_activated: string;
  disabled_categories: string[];
}

export interface Customization {
  id: string;
  exam_id: string;
  name: string;
  time_added: Date;
  duration: number;
  question_quantity: number;
  copilot_activated: boolean;
  disabled_categories: string[];
}
