import { SettingsFormData } from "@/lib/settings-schema";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import { SVGProps } from "react";
import { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { settings } from "@/hooks/useSettings";

// Form styles
const formFieldStyles = flex({
  gap: '1rem',
  alignItems: 'center',
});

const labelStyles = css({
  fontWeight: 'medium',
  flexShrink: 0,
  fontSize: 'sm',
  mr: 'auto',
});

const inputStyles = css({
  width: '80px',
  padding: '0.25rem',
  border: '1px solid',
  borderColor: 'fg.muted',
  borderRadius: 'md',
  fontSize: 'medium',
  color: 'fg',
  _focus: {
    outline: 'none',
    borderColor: 'fg',
  },
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const textInputStyles = css({
  width: '100px',
  padding: '0.25rem',
  border: '1px solid',
  borderColor: 'fg.muted',
  borderRadius: 'md',
  fontSize: 'medium',
  color: 'fg',
  _focus: {
    outline: 'none',
    borderColor: 'fg',
  },
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const errorStyles = css({
  color: 'red.500',
  fontSize: 'sm',
  fontWeight: 'medium',
  ml: "auto",
  textAlign: 'right',
});


export function FormField({ description, form, id, label, inputType, inputProps }: { description?: string, form: UseFormReturn<SettingsFormData>, id: Path<SettingsFormData>, label: string, inputType: 'number' | 'text' | 'color', inputProps: React.InputHTMLAttributes<HTMLInputElement> }) {
  const error = form.formState.errors[id];
  const defaultValue = settings[id].fallback;
  const isChanged = form.watch(id) !== defaultValue;
  return (
    <>
      <div className={formFieldStyles} title={description}>
        <label className={labelStyles} htmlFor={id}>{label}</label>
        {isChanged && <button title="Reset to default" type="button" className={css({
          color: 'fg.muted',
          _hover: {
            color: 'fg',
            cursor: 'pointer',
          },
        })} onClick={() => {
          form.setValue(id, defaultValue);
        }}>
          <RiLoopLeftLine />
        </button>}
        <input type={inputType} className={inputType === 'number' ? inputStyles : textInputStyles} {...inputProps} id={id} />
      </div>
      {error?.message && <div className={errorStyles}>{error.message as string}</div>}
    </>
  );
}


export function RiLoopLeftLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 4a7.99 7.99 0 0 0-6.616 3.5H8v2H2v-6h2V6a9.98 9.98 0 0 1 8-4c5.523 0 10 4.477 10 10h-2a8 8 0 0 0-8-8m-8 8a8 8 0 0 0 14.616 4.5H16v-2h6v6h-2V18a9.98 9.98 0 0 1-8 4C6.477 22 2 17.523 2 12z" /></svg>
  )
}