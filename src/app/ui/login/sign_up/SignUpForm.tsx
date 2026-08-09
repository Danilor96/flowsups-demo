'use client';

import { FormElement } from '&/login/FormElement';
import { FormInput } from '&/login/FormInput';
import { FormLabel } from '&/login/FormLabel';
import { FormSubmitButton } from '&/login/FormSubmitButton';
import { useFormState } from 'react-dom';
import { userRegister } from '@/app/libs/actions';

export function SignUpForm({ newUserEmail }: { newUserEmail: string }) {
  const [state, dispatch] = useFormState(userRegister, null);

  return (
    <FormElement action={dispatch}>
      <input type="email" name="email" defaultValue={newUserEmail} hidden />
      <p className="text-[2.25vh] font-semibold leading-[4.183333vh] text-mainColor mb-[1.5vh]">
        <span className="text-formSecondaryColor">Welcome</span> {newUserEmail}
      </p>
      <div className="w-[24.583333vw] flex flex-row justify-between items-center mb-[1.296296vh]">
        <aside className="w-[11.484375vw]">
          <FormLabel htmlFor="name" title="Name" />
          <FormInput text={true} name="name" id="name" placeholder="Jon" />
          {state && <p className="text-[2vh] text-red-500">{state.errors?.name}</p>}
        </aside>
        <aside className="w-[11.484375vw]">
          <FormLabel htmlFor="lastName" title="Last name" />
          <FormInput text={true} name="lastName" id="lastName" placeholder="Doe" />
          {state && <p className="text-[2vh] text-red-500">{state.errors?.lastName}</p>}
        </aside>
      </div>
      <FormLabel htmlFor="password" title="Password" />
      <FormInput password={true} name="password" id="password" />
      {state && <p className="text-[2vh] text-red-500">{state.errors?.password}</p>}
      <FormLabel htmlFor="confirmPassword" title="Confirm password" />
      <FormInput
        password={true}
        confirmPassword={true}
        name="confirmPassword"
        id="confirmPassword"
      />
      {state && <p className="text-[2vh] text-red-500">{state.errors?.confirmPassword}</p>}
      <FormInput
        checkbox={true}
        name="terms"
        terms={true}
        checkboxText="I agree with the"
        checkboxLinkText="terms and conditions"
      />
      <FormSubmitButton buttonText="Continue" />
    </FormElement>
  );
}
