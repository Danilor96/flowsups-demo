import { DetailedHTMLProps, FormEventHandler, FormHTMLAttributes } from 'react';

export function FormElement({ children, action }: { children: React.ReactNode; action?: any }) {
  return (
    <form className="w-full lg:w-[24.579167vw] flex flex-col" action={action}>
      {children}
    </form>
  );
}
