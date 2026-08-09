'use client';

import { storeUserRegistrationCode } from '@/app/libs/actions';
import { Roles } from '@/app/libs/definitions';
import { useFormState } from 'react-dom';

const initialState = {
  errors: {},
  message: '',
};

export default function SendEmailForm({ roles }: { roles: Roles }) {
  const [state, dispatch] = useFormState(storeUserRegistrationCode, null);

  return (
    <form
      className="w-96 flex flex-col justify-center items-center p-2 gap-2 border border-gray-300 rounded mt-4 mx-auto"
      action={dispatch}
    >
      <div className="w-full">
        <label htmlFor="email">Email</label>
      </div>
      <input
        required
        type="email"
        name="email"
        id="email"
        className="w-full border border-gray-300 rounded p-2"
      />
      {state && <p>{state.errors.email}</p>}
      <div className="w-full">
        <label htmlFor="role">Roles</label>
      </div>
      <select
        required
        name="role"
        id="role"
        defaultValue=""
        className="w-full text-center border border-gray-300 rounded p-2"
      >
        <option className="w-full text-center" value="" disabled>
          Select a role
        </option>
        {roles?.map((role: any) => (
          <option className="w-full text-center" key={role.id} value={role.id}>
            {role.role}
          </option>
        ))}
      </select>
      {state && <p>{state.errors.role}</p>}
      <button type="submit" className="w-[30%] border border-gray-300 rounded hover:opacity-80">
        send email
      </button>
    </form>
  );
}
