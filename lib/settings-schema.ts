import * as z from "zod";

export const settingsFormSchema = z.object({
  wordsPerMinute: z
    .number()
    .min(1, "Must be at least 1")
    .max(9999, "Must be at most 9999"),
  startDelay: z
    .number()
    .min(0, "Must be at least 0")
    .max(10, "Must be at most 10"),
  punctuationDelay: z
    .number()
    .min(1, "Must be at least 1")
    .max(20, "Must be at most 20"),
  triggerHotkey: z.string().min(1, "Required"),
  balanceOutwardHotkey: z.string().min(1, "Required"),
  scale: z
    .number()
    .min(0.1, "Must be at least 0.1")
    .max(5, "Must be at most 5"),
  cardBackgroundColor: z.string().min(1, "Required"),
  cardTextColor: z.string().min(1, "Required"),
  cardAccentColor: z.string().min(1, "Required"),
  newLineChar: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;
