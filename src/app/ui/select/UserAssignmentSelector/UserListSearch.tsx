import React, { useState, useRef, useEffect } from 'react';
import { CheckedIcon, SearchLensGreen, SelectDropIcon, UsersIcon, XIcon } from '../../icons/Icons';
import { User } from '@/app/libs/definitions';
import { getColorFromName, getInitials } from './utils';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

interface UserListProps {
  users: User[];
  selectedIds: string[];
  toggleUser: (id: string) => void;
  userOnClick?: (user: User) => void;
}

export function UserListSearch({ users, selectedIds, toggleUser, userOnClick }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    `${user.name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors">
            <SearchLensGreen />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400 text-slate-700"
            value={handlingCapitalWords(searchTerm)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* User List */}
      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
        {filteredUsers.length > 0 ? (
          <>
            {filteredUsers.map((user) => {
              const isSelected = selectedIds.includes(user.id.toString());
              return (
                <UserItemOption
                  key={user.id}
                  user={user}
                  isSelected={isSelected}
                  toggleUser={toggleUser}
                  userOnClick={userOnClick}
                />
              );
            })}
          </>
        ) : (
          <div className="py-8 text-center text-slate-400 flex flex-col items-center">
            <div className="opacity-50">
              <UsersIcon color="#ccfbf1" />
            </div>
            <p className="text-sm">Not found</p>
          </div>
        )}
      </div>
    </>
  );
}

export function UserItemOption({
  user,
  isSelected,
  toggleUser,
  userOnClick,
}: {
  user: User;
  isSelected: boolean;
  toggleUser: (id: string) => void;
  userOnClick?: (user: User) => void;
}) {
  const userName = `${user.name || ''} ${user.last_name || ''}`;
  return (
    <div
      key={user.id}
      onClick={() => {
        toggleUser(user.id.toString());
        userOnClick?.(user);
      }}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 mb-1 ${
        isSelected
          ? 'bg-teal-50 border border-teal-100'
          : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-offset-1 ${getColorFromName(
            userName,
          )} ${isSelected ? 'ring-teal-500' : 'ring-transparent'}`}
        >
          {getInitials(userName)}
        </div>
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}
          >
            {userName}
          </span>
          <span className="text-xs text-slate-400">{user.email}</span>
        </div>
      </div>
      {/* Checkbox */}
      <div
        className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'bg-teal-600 text-white shadow-sm scale-100'
            : 'bg-slate-100 text-transparent scale-90 group-hover:bg-slate-200'
        }`}
      >
        {isSelected && <CheckedIcon color="white" />}
      </div>
    </div>
  );
}
