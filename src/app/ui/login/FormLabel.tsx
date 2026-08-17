export function FormLabel({ htmlFor, title }: { htmlFor: string; title: string }) {
  return (
    <label
      className="h-[2.407407vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-formColor mb-[1.666667vh] max-lg:h-auto max-lg:text-sm max-lg:mb-2"
      htmlFor={htmlFor}
    >
      {title}
    </label>
  );
}
