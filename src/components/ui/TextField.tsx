export function TextField({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-charcoal">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-3 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal placeholder:text-charcoal/40"
      />
    </label>
  );
}
