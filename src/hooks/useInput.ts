import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Melebarkan tipe literal ("" -> string, false -> boolean). */
type Widen<T> = T extends string ? string : boolean;

/**
 * Custom hook two-way data binding untuk elemen formulir.
 * Mengembalikan [value, onChange, setValue].
 */
export default function useInput<T extends string | boolean = string>(
  defaultValue: T = "" as T
) {
  const [value, setValue] = useState<Widen<T>>(defaultValue as Widen<T>);

  const onChange = useCallback((event: ChangeEvent<InputElement>) => {
    const target = event.target as HTMLInputElement;
    setValue((target.type === "checkbox" ? target.checked : target.value) as Widen<T>);
  }, []);

  return [value, onChange, setValue] as const;
}
