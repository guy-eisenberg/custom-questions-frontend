import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useExam, useSelector } from '../../hooks';
import { c } from '../../lib';
import { togglePaused } from '../../redux';
import { ToggleButton } from '../core';

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  minified?: boolean;
  mobileBackButton?: boolean;
  showExitModal?: () => void;
  showTrainingModeModal?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  minified = false,
  mobileBackButton = false,
  showExitModal,
  showTrainingModeModal,
  ...rest
}) => {
  const navigate = useNavigate();

  const exam = useExam();

  const dispatch = useDispatch();
  const {
    time: t,
    trainingMode,
    score,
    mode,
    customization,
  } = useSelector((state) => state.exam);

  const [showRemaining, setShowRemaining] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', onBackgroundClick);

    return () => document.removeEventListener('click', onBackgroundClick);

    function onBackgroundClick() {
      setMenuOpen(false);
    }
  }, []);

  const modeLabel = (() => {
    switch (mode) {
      case 'normal':
        return 'Normal';
      case 'copilot':
        return 'CoPilot';
      case 'customization':
        return 'Customization';
    }
  })();

  const time = showRemaining ? exam.duration - t : t;

  const questionQuantity =
    mode === 'customization' && customization
      ? customization.question_quantity
      : exam.question_quantity;

  return (
    <nav
      {...rest}
      className={c(
        'sticky top-0 left-0 right-0 z-10 flex select-none text-white',
        trainingMode && !minified ? 'bg-[#82dd47]' : 'bg-[#3793d1]',
        rest.className
      )}
    >
      {mobileBackButton && (
        <button
          className="flex h-full items-center gap-2 bg-theme-dark-blue px-4 transition hover:brightness-95 lg:hidden"
          onClick={() => navigate(`/${exam.id}`, { replace: true })}
        >
          <img alt="back icon" src="images/icon_back.svg" className="h-4" />
          Back
        </button>
      )}
      <div className="flex flex-1 items-center gap-[1vw] py-2 px-3">
        <button
          className="h-full shrink-0 transition hover:scale-105 hover:brightness-105 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();

            setMenuOpen(!menuOpen);
          }}
        >
          <img
            alt="roundel logo"
            src="images/logo_roundel.svg"
            className="h-full"
            draggable={false}
          />
        </button>
        <div className="flex items-baseline gap-[1vw]">
          <span className="text-xl font-extralight">{exam.name}</span>
          <span
            className={c(
              'font-extralight opacity-50 lg:block',
              !minified && 'hidden'
            )}
          >
            {modeLabel} Mode
          </span>
        </div>
      </div>
      {!minified && (
        <>
          <div
            className={c(
              'hidden items-center py-2 px-[1vw] lg:flex',
              trainingMode ? 'bg-[#74d73c]' : 'bg-theme-dark-blue'
            )}
          >
            <img
              alt="training mode icon"
              src="images/icon_mortarboard.svg"
              className="mr-4 h-[65%]"
              draggable={false}
            />
            <span className="mr-8">Training Mode</span>
            <ToggleButton
              color={trainingMode ? 'green' : 'blue'}
              isChecked={trainingMode}
              onClick={(e) => {
                e.stopPropagation();

                if (showTrainingModeModal) showTrainingModeModal();
              }}
            />
          </div>
          <div className="flex items-center gap-[2vw] py-2 px-3 lg:bg-[#232323]">
            <div className="hidden h-full lg:flex">
              <ActionButton
                className="h-full"
                icon="icon_playpause.svg"
                onClick={() => dispatch(togglePaused())}
                disabled={!trainingMode}
              />
              <ActionButton
                className="h-full"
                icon="icon_settings.svg"
                disabled
              />
              <ActionButton
                className="h-full"
                icon="icon_performance.svg"
                disabled
              />
              <ActionButton className="h-full" icon="icon_help.svg" disabled />
              <ActionButton
                className="h-full"
                icon="icon_exit.svg"
                onClick={(e) => {
                  e.stopPropagation();

                  if (showExitModal) showExitModal();
                }}
              />
            </div>
            <div className="flex gap-4 align-baseline text-lg text-white/80">
              <span>
                <span className="hidden opacity-40 lg:inline-block">
                  {showRemaining ? 'Remaining' : 'Elapsed'}:
                </span>
                <span className="opacity-40 lg:hidden">
                  {showRemaining ? 'R' : 'E'}:
                </span>{' '}
                <span>
                  {Math.floor(time / 60) < 10 && '0'}
                  {Math.floor(time / 60)}:{time % 60 < 10 && '0'}
                  {time % 60}
                </span>
              </span>
              <span>
                <span className="hidden opacity-50 lg:inline-block">
                  Score:
                </span>
                <span className="opacity-50 lg:hidden">S:</span>{' '}
                <span>
                  {score} of {questionQuantity}
                </span>
              </span>
            </div>
          </div>
          <div
            className={c(
              'absolute top-full left-0 right-0 h-[calc(100vh-100%)] bg-black/40 transition-all',
              menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            <div
              className="flex w-5/6 flex-col bg-[#e0e0e0] text-theme-dark-gray shadow-lg lg:w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <NavbarMenuButton
                onClick={() => {
                  setMenuOpen(false);

                  if (showTrainingModeModal) showTrainingModeModal();
                }}
              >
                Enable Training Mode
              </NavbarMenuButton>
              <NavbarMenuButton onClick={() => dispatch(togglePaused())}>
                Play/Pause
              </NavbarMenuButton>
              <p className="py-4 px-6 font-extralight">Font Size:</p>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Increase
              </NavbarMenuButton>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Decrease
              </NavbarMenuButton>
              <NavbarMenuButton
                onClick={() => setShowRemaining(!showRemaining)}
              >
                Switch Elapsed/Remaining
              </NavbarMenuButton>
              <p className="py-4 px-6 font-extralight">Go to:</p>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Performance
              </NavbarMenuButton>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                User Guide
              </NavbarMenuButton>
              <NavbarMenuButton
                onClick={() => {
                  setMenuOpen(false);

                  if (showExitModal) showExitModal();
                }}
              >
                Exit to Main Menu
              </NavbarMenuButton>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;

const ActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: string }
> = ({ icon, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'flex h-full w-10 items-center justify-center transition',
        rest.disabled
          ? 'opacity-30'
          : 'hover:scale-105 hover:brightness-125 active:scale-95 active:brightness-95',
        rest.className
      )}
    >
      <img
        alt="action button"
        src={`images/${icon}`}
        className="w-5"
        draggable={false}
      />
    </button>
  );
};

const NavbarMenuButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'group py-4 px-6 text-left',
        rest.disabled ? 'opacity-30' : 'hover:bg-theme-blue hover:text-white',
        rest.className
      )}
    >
      <span>{children}</span>
    </button>
  );
};
