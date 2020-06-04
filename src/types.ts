export type FormSaveData = {
  description: string;
  answers: { text: string; main?: boolean }[];
  teachers: number[];
}

export type HandleSwitchTypes = "isChecked" | "answer" | "description";

export type ChangeHandleTypes = (
  value: string | boolean,
  type: HandleSwitchTypes,
  inputId?: number
  ) => void

