export type FormSaveData = {
  description: string;
  answers: { text: string, main?: boolean }[];
  teachers: number[];
}