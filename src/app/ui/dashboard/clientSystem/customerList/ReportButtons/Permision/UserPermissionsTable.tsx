import { Users } from '@/app/libs/definitions';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';

interface UserPermissionsTableProps {
  users: Users;
  handleSelect: (id: number) => void;
  idsSelected: number[];
}

export const UserPermissionsTable = ({ users, handleSelect, idsSelected }: UserPermissionsTableProps) => {
  return (
    <table className="w-full h-fit  relative">
      <thead className="w-full h-10 bg-[#00A78B] rounded-xl sticky">
        <tr className="w-full h-full rounded-xl pl-2 sticky">
          <th className="w-1/3 h-full text-start text-white pl-4">Name</th>
          <th className="w-1/3 h-full text-start text-white">Role</th>
          <th className="w-1/3 h-full text-center text-white">Access</th>
        </tr>
      </thead>
      <tbody className="w-full h-full overflow-auto text-gray-700">
        {users?.map((user, index) => (
          <tr key={user.id} className={`w-full h-10 ${index % 2 === 0 ? '' : 'bg-[#C9EBE6]'}`}>
            <td className="w-1/3 h-full min-w-[300px] text-start pl-4 pr-6">
              {user.name + ` ${user.last_name ? user.last_name : ''}`}
            </td>
            <td className="w-1/3 h-full text-start">{user.user_has[0].role.role}</td>
            <td className="w-1/3 h-full text-center">
              <div className=" flex items-center justify-center w-full">
                <CheckboxInput
                  name="access"
                  value={user.user_has[0].role.role}
                  checked={idsSelected.includes(user.id)}
                  onChange={() => handleSelect(user.id)}
                  chekcboxText=""
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
