import React, { useState } from 'react';
import { c } from '../../lib';
import { ToggleButton } from '../core';

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar: React.FC<NavbarProps> = ({ ...rest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trainingModeChecked, setTrainingModeChecked] = useState(false);

  return (
    <nav
      {...rest}
      className={c(
        'relative flex h-14 select-none bg-[#3793d1] text-white',
        rest.className
      )}
    >
      <div className="flex flex-1 items-center gap-[1vw] p-2">
        <button
          className="h-full shrink-0 transition hover:scale-105 hover:brightness-105 active:scale-95"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            alt="roundel logo"
            src="images/logo_roundel.svg"
            className="h-full"
            draggable={false}
          />
        </button>
        <div className="flex items-baseline gap-[0.75vw]">
          <span className="text-xl font-extralight">Maths</span>
          <span className="hidden font-extralight opacity-30 lg:block">
            Normal Mode
          </span>
        </div>
      </div>
      <div className="hidden items-center bg-[#1b8ac0] py-2 px-[1vw] lg:flex">
        <img
          alt="training mode icon"
          src="images/icon_mortarboard.svg"
          className="mr-4 h-[65%]"
          draggable={false}
        />
        <span className="mr-8">Training Mode</span>
        <ToggleButton
          checked={trainingModeChecked}
          onChange={(e) => {
            setTrainingModeChecked(e.target.checked);
          }}
        />
      </div>
      <div className="flex items-center gap-[2vw] p-2 lg:bg-[#232323]">
        <div className="hidden h-full lg:flex">
          <ActionButton className="h-full" icon="icon_playpause.svg" />
          <ActionButton className="h-full" icon="icon_settings.svg" />
          <ActionButton className="h-full" icon="icon_performance.svg" />
          <ActionButton className="h-full" icon="icon_help.svg" />
          <ActionButton className="h-full" icon="icon_exit.svg" />
        </div>
        <div className="flex gap-4 align-baseline text-lg text-white/80">
          <span className="hidden lg:block">
            <span className="opacity-40">Elapsed:</span> <span>00:00</span>
          </span>
          <span className="lg:hidden">
            <span className="opacity-40">E:</span> <span>00:00</span>
          </span>
          <span className="hidden lg:block">
            <span className="opacity-40">Score:</span> <span>1 of 20</span>
          </span>
          <span className="lg:hidden">
            <span className="opacity-40">S:</span> <span>1 / 20</span>
          </span>
        </div>
      </div>
      <div
        className={c(
          'absolute top-full left-0 right-0 h-[calc(100vh-100%)] bg-black/40 transition-all',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div className="flex w-5/6 flex-col bg-[#e0e0e0] text-theme-dark-gray shadow-lg lg:w-96">
          <NavbarMenuButton>Enable Training Mode</NavbarMenuButton>
          <NavbarMenuButton>Play/Pause</NavbarMenuButton>
          <p className="py-4 px-6">Font Size:</p>
          <NavbarMenuButton className="py-3 text-xs">Increase</NavbarMenuButton>
          <NavbarMenuButton className="py-3 text-xs">Decrease</NavbarMenuButton>
          <NavbarMenuButton>Switch Elapsed/Remaining</NavbarMenuButton>
          <p className="py-4 px-6">Go to:</p>
          <NavbarMenuButton className="py-3 text-xs">
            Performance
          </NavbarMenuButton>
          <NavbarMenuButton className="py-3 text-xs">
            User Guide
          </NavbarMenuButton>
          <NavbarMenuButton>Exit to Main Menu</NavbarMenuButton>
        </div>
      </div>
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
