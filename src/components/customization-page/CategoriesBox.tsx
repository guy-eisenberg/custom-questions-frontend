import { useState } from 'react';
import { c } from '../../lib';
import { Category } from '../../types';
import { Button } from '../core';

interface CategoriesBoxProps extends React.HTMLAttributes<HTMLUListElement> {
  categories: Category[];
}

const CategoriesBox: React.FC<CategoriesBoxProps> = ({
  categories,
  ...rest
}) => {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<
    number | undefined
  >();

  return (
    <>
      <ul
        {...rest}
        className={c(
          'flex flex-col gap-2 border border-theme-light-gray bg-[#f9f9f9] p-4',
          rest.className
        )}
      >
        {categories.map((category, i) => (
          <CategoryRow
            index={i}
            category={category}
            type="category"
            openCategoryIndex={openCategoryIndex}
            setOpenCategoryIndex={setOpenCategoryIndex}
            key={category.id}
          />
        ))}
      </ul>
      <div className="mt-[1vh] flex items-center">
        <Button color="gray" className="!px-2 text-xs">
          Select All
        </Button>
        <span className="text-theme-light-gray">|</span>
        <Button color="gray" className="!px-2 text-xs">
          Deselect All
        </Button>
      </div>
    </>
  );
};

export default CategoriesBox;

interface CategoryRowProps extends React.LiHTMLAttributes<HTMLLIElement> {
  index: number;
  category: Category;
  type: 'category' | 'sub-category';
  openCategoryIndex?: number | undefined;
  setOpenCategoryIndex?: (index: number | undefined) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  index: i,
  category,
  type,
  openCategoryIndex,
  setOpenCategoryIndex,
  ...rest
}) => {
  return (
    <li {...rest}>
      <div className="flex items-center justify-between">
        <button
          className={c(
            'flex items-center gap-2',
            type === 'category' && 'text-lg',
            type === 'sub-category' && 'text-sm',
            category.sub_categories.length === 0 && 'cursor-default'
          )}
          onClick={() => {
            if (category.sub_categories.length > 0 && setOpenCategoryIndex) {
              if (i === openCategoryIndex) setOpenCategoryIndex(undefined);
              else setOpenCategoryIndex(i);
            }
          }}
        >
          {category.name}
          {category.sub_categories.length > 0 && (
            <img
              alt="arrow icon"
              src="images/icon_arrow.svg"
              className="h-2 rotate-180 opacity-30"
            />
          )}
        </button>
        <Checkbox checked={true} />
      </div>
      {type === 'category' && category.sub_categories.length > 0 && (
        <ul
          className={c(
            'ml-4 flex flex-col gap-1 overflow-hidden transition-all',
            i === openCategoryIndex && 'mt-2'
          )}
          style={{
            maxHeight:
              i === openCategoryIndex ? category.sub_categories.length * 24 : 0,
          }}
        >
          {category.sub_categories.map((category) => (
            <CategoryRow
              index={i}
              category={category}
              type="sub-category"
              key={category.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Checkbox: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked: boolean | 'half';
    full?: boolean;
  }
> = ({ checked = true, full = false, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'relative h-4 w-4 rounded-sm',
        checked
          ? full
            ? 'bg-theme-light-gray'
            : 'bg-theme-blue'
          : 'border border-theme-light-gray bg-white',
        rest.className
      )}
    >
      <img
        alt="check icon"
        src="images/icon_check.svg"
        className={c(
          'absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2',
          checked === true ? 'opacity 100' : 'opacity-0'
        )}
      />
      <img
        alt="sub icon"
        src="images/icon_sub.svg"
        className={c(
          'absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2',
          checked === 'half' ? 'opacity 100' : 'opacity-0'
        )}
      />
    </button>
  );
};
