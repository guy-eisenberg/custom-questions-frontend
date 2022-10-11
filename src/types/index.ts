export interface DBQuestion {
  body: string;
  answers: string[];
  rightAnswerIndex: number;
}

export interface Question extends DBQuestion {
  selectedAnswerIndex?: number;
}

export interface Category {
  id: string;
  name: string;
  sub_categories: Category[];
}

export interface Customization {
  id: string;
  name: string;
  date: string;
}
