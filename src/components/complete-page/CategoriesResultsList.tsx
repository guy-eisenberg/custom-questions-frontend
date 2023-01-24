import { useMemo, useRef, useState } from 'react';
import { useExam, useSelector } from '../../hooks';
import { c, p } from '../../lib';
import { CategoryResults } from '../../redux';
import { Category, Question } from '../../types';

type AnsweredQuestion = Question & {
  selectedAnswerId?: string;
};

interface FlatCategoryResult {
  id: string;
  name: string;
  questions: AnsweredQuestion[];
  subCategories: FlatCategoryResult[];
  correctPrecentage: number;
}

interface CategoriesResultsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedQuestion: AnsweredQuestion | undefined;
  setSelectedQuestion: (question: AnsweredQuestion) => void;
}

const CategoriesResultsList: React.FC<CategoriesResultsListProps> = ({
  selectedQuestion,
  setSelectedQuestion,
  ...rest
}) => {
  const exam = useExam();

  const { categoriesResults } = useSelector((state) => state.exam);

  const allCategories = useMemo(() => {
    return exam.categories.reduce(
      (arr, category) => [...arr, ...flatCategory(category)],
      [] as Category[]
    );

    function flatCategory(category: Category): Category[] {
      return [
        category,
        ...category.sub_categories.reduce(
          (arr, category) => [...arr, ...flatCategory(category)],
          [] as Category[]
        ),
      ];
    }
  }, [exam.categories]);

  const flatResults = useMemo(() => {
    return Object.entries(categoriesResults).map(flatCategory);

    function getCorrectAnswers(category: CategoryResults): number {
      return (
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getCorrectAnswers(category),
          0
        ) +
        Object.values(category.questions).reduce((sum, question) => {
          const rightAnswer = question.answers.find(
            (answer) => answer.is_right
          )!;

          return sum + (question.selectedAnswerId === rightAnswer.id ? 1 : 0);
        }, 0)
      );
    }

    function getQuestionAmount(category: CategoryResults): number {
      return (
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getQuestionAmount(category),
          0
        ) + Object.values(category.questions).length
      );
    }

    function flatCategory(
      result: [string, CategoryResults]
    ): FlatCategoryResult {
      const [id, category] = result;

      const categoryData = allCategories.find(
        (category) => category.id === id
      )!;

      return {
        id,
        ...category,
        name: categoryData.name,
        subCategories: Object.entries(category.subCategories).map(flatCategory),
        questions: Object.values(category.questions),
        correctPrecentage: Math.round(
          (getCorrectAnswers(category) / getQuestionAmount(category)) * 100
        ),
      };
    }
  }, [allCategories, categoriesResults]);

  return (
    <div {...rest} className={c('flex bg-[#f7f7f7]', rest.className)}>
      <ul className="flex flex-col items-center gap-4 overflow-y-auto p-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-theme-light-gray/20">
        {flatResults.map((category) => {
          return (
            <CategoryResultsList
              className="w-full"
              category={category}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              key={category.id}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default CategoriesResultsList;

const CategoryResultsList: React.FC<
  React.HTMLAttributes<HTMLLIElement> & {
    category: FlatCategoryResult;
    selectedQuestion: AnsweredQuestion | undefined;
    setSelectedQuestion: (question: AnsweredQuestion) => void;
  }
> = ({ category, selectedQuestion, setSelectedQuestion, ...rest }) => {
  const menuRef = useRef<HTMLUListElement>(null);

  const [expanded, setExpanded] = useState(false);

  const color = (() => {
    if (category.correctPrecentage <= 100 && category.correctPrecentage >= 75)
      return '#87dc49';
    else if (
      category.correctPrecentage < 75 &&
      category.correctPrecentage >= 60
    )
      return '#edd53c';
    else if (category.correctPrecentage < 60) return '#f66464';
  })();

  return (
    <li {...rest}>
      <button
        className="relative flex w-full justify-between rounded-md py-2 px-4 hover:brightness-90"
        style={{ color, backgroundColor: `${color}44` }}
        onClick={() => setExpanded(!expanded)}
      >
        <img
          alt="arrow icon"
          src={p('images/icon_arrow.svg')}
          className={c(
            'absolute top-1/2 right-[calc(100%+0.5rem)] h-2 w-2 -translate-y-1/2 opacity-20 transition',
            expanded ? 'rotate-[270deg]' : 'rotate-180'
          )}
        />
        <span>{category.name}</span>
        <span>{category.correctPrecentage}%</span>
      </button>
      <ul
        className="mt-4 flex flex-col gap-4 overflow-hidden text-sm text-theme-dark-gray transition-all"
        style={{
          marginTop: expanded ? 16 : 0,
          maxHeight: expanded ? undefined : 0,
        }}
        ref={menuRef}
      >
        {category.questions.map((question) => (
          <AnsweredQuestionElement
            className={
              question.id === selectedQuestion?.id
                ? 'font-bold text-black'
                : undefined
            }
            question={question}
            onClick={() => setSelectedQuestion(question)}
            key={question.id}
          />
        ))}
        {category.subCategories.map((subCategory) => (
          <SubCategoryResultsList
            category={subCategory}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            key={subCategory.id}
          />
        ))}
      </ul>
    </li>
  );
};

const SubCategoryResultsList: React.FC<
  React.HTMLAttributes<HTMLLIElement> & {
    category: FlatCategoryResult;
    selectedQuestion: AnsweredQuestion | undefined;
    setSelectedQuestion: (question: AnsweredQuestion) => void;
  }
> = ({ category, selectedQuestion, setSelectedQuestion, ...rest }) => {
  return (
    <li {...rest}>
      <b>{category.name}</b>
      <ul className="mt-4 flex flex-col gap-4 overflow-hidden text-sm text-theme-medium-gray">
        {category.questions.map((question) => (
          <AnsweredQuestionElement
            className={
              question.id === selectedQuestion?.id
                ? 'font-bold text-black'
                : undefined
            }
            question={question}
            onClick={() => setSelectedQuestion(question)}
            key={question.id}
          />
        ))}
      </ul>
    </li>
  );
};

const AnsweredQuestionElement: React.FC<
  React.HTMLAttributes<HTMLLIElement> & { question: AnsweredQuestion }
> = ({ question, ...rest }) => {
  const right = useMemo(() => {
    const correctAnswer = question.answers.find((answer) => answer.is_right)!;

    return question.selectedAnswerId === correctAnswer.id;
  }, [question]);

  return (
    <li
      {...rest}
      className={c(
        'flex cursor-pointer items-center justify-between gap-4 rounded-md py-2 px-3 hover:bg-theme-light-gray/40',
        rest.className
      )}
      key={question.id}
    >
      <span>{question.body}</span>
      <img
        alt="answer icon"
        className="h-5 w-5"
        src={p(`images/icon_${right ? 'correct_green' : 'incorrect_red'}.svg`)}
      />
    </li>
  );
};
