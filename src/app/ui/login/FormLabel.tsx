export function FormLabel({ htmlFor, title }: { htmlFor: string; title: string }) {
  return (
    <label
      className="h-[2.407407vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-formColor mb-[1.666667vh]"
      htmlFor={htmlFor}
    >
      {title}
    </label>
  );
}
