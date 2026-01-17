import { FieldValues, UseFormRegisterReturn } from "react-hook-form";

interface RadioFieldProps<T extends FieldValues> {
  label: string;
  value: string;
  register: UseFormRegisterReturn;
  checked: boolean;
}

export default function RadioField<T extends FieldValues>({
  label,
  value,
  register,
  checked,
}: RadioFieldProps<T>) {
  return (
    <label className="flex items-center gap-2">
      <input type="radio" value={value} {...register} checked={checked} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
