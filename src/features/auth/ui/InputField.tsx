import { FieldValues, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel";
  register: UseFormRegisterReturn;
  error?: string;
}

export default function InputField<T extends FieldValues>({
  label,
  placeholder = "",
  type = "text",
  register,
  error,
}: InputFieldProps<T>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-md border px-3 py-2 outline-none transition ${
          error ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-gray-400"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}
