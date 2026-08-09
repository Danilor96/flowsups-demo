export const COLOR_PALETTE = [
  'bg-teal-600',
  'bg-emerald-500',
  'bg-cyan-600',
  'bg-orange-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-yellow-600',
  'bg-red-600',
  'bg-pink-600',
  'bg-blue-600',
  'bg-gray-600',
  'bg-sky-600',
  'bg-slate-600',
  'bg-slate-400',
  'bg-amber-600',
  'bg-lime-600',
  'bg-stone-500',
];

export const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

export const getInitials = (name: any) => {
  return name
    .split(' ')
    .map((n: any) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};