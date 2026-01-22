import { css, cx } from '@/styled-system/css';
import { stack, flex } from '@/styled-system/patterns';
import { useSettings, settings } from '@/hooks/useSettings';
import { SettingsFormData, settingsFormSchema } from '@/lib/settings-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form-field';
import { useEffect, useRef } from 'react';
import { browser } from '#imports';

// Layout styles
const containerStyles = css({
  padding: '24px',
  minWidth: '250px',
  width: '320px',
  height: '100%',
  fontFamily: "'Geist Mono Variable', monospace",
  bg: "bg",
  color: "fg",
});

const titleStyles = css({
  fontWeight: 'bold',
  fontSize: '2xl',
});


// Helper text styles
const helperTextStyles = css({
  color: 'fg.muted',
  fontSize: 'sm',
});

function App() {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      wordsPerMinute: settings.wordsPerMinute.fallback,
      startDelay: settings.startDelay.fallback,
      triggerHotkey: settings.triggerHotkey.fallback,
      balanceOutwardHotkey: settings.balanceOutwardHotkey.fallback,
      scale: settings.scale.fallback,
      cardBackgroundColor: settings.cardBackgroundColor.fallback,
      cardTextColor: settings.cardTextColor.fallback,
      cardAccentColor: settings.cardAccentColor.fallback,
      punctuationDelay: settings.punctuationDelay.fallback,
      newLineChar: settings.newLineChar.fallback,
    },
    shouldFocusError: false, mode: "onChange",
  });

  // Track if we're updating from storage to prevent infinite loops
  const isUpdatingFromStorage = useRef(false);
  const isInitialLoad = useRef(true);

  // Reset form when settings change from storage (but not during our own updates)
  useEffect(() => {
    async function init() {
      form.reset({
        wordsPerMinute: await settings.wordsPerMinute.getValue(),
        startDelay: await settings.startDelay.getValue(),
        triggerHotkey: await settings.triggerHotkey.getValue(),
        balanceOutwardHotkey: await settings.balanceOutwardHotkey.getValue(),
        scale: await settings.scale.getValue(),
        cardBackgroundColor: await settings.cardBackgroundColor.getValue(),
        cardTextColor: await settings.cardTextColor.getValue(),
        cardAccentColor: await settings.cardAccentColor.getValue(),
        punctuationDelay: await settings.punctuationDelay.getValue(),
        newLineChar: await settings.newLineChar.getValue(),
      });
    }
    init();
  }, [
    form,
  ]);

  const openLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault(); // Prevent default anchor behavior
    browser.tabs.create({ url: url });
  };

  const onSubmit = async (data: SettingsFormData) => {
    await settings.wordsPerMinute.setValue(data.wordsPerMinute);
    await settings.startDelay.setValue(data.startDelay);
    await settings.triggerHotkey.setValue(data.triggerHotkey);
    await settings.balanceOutwardHotkey.setValue(data.balanceOutwardHotkey);
    await settings.scale.setValue(data.scale);
    await settings.cardBackgroundColor.setValue(data.cardBackgroundColor);
    await settings.cardTextColor.setValue(data.cardTextColor);
    await settings.cardAccentColor.setValue(data.cardAccentColor);
    await settings.punctuationDelay.setValue(data.punctuationDelay);
    await settings.newLineChar.setValue(data.newLineChar ?? " ");
    form.reset(data, { keepDirty: false });
  };

  // Auto-save when form values change, but only if valid
  useEffect(() => {
    if (
      form.formState.isDirty &&
      form.formState.isValid
    )
      form.handleSubmit(onSubmit)();
  }, [form.formState.isDirty, form.formState.isValid]);

  const { value: wordsPerMinute } = useSettings(settings.wordsPerMinute);
  const { value: triggerHotkey } = useSettings(settings.triggerHotkey);
  const { value: balanceOutwardHotkey } = useSettings(settings.balanceOutwardHotkey);
  const { value: cardAccentColor } = useSettings(settings.cardAccentColor);


  return (
    <div className={containerStyles}>
      <div className={stack({ gap: '6' })}>
        <h1 className={titleStyles}>Read <span style={{ color: cardAccentColor }}>I</span>t Fast</h1>
        <div className={helperTextStyles}>
          <p className={css({
            "& > strong":
            {
              fontWeight: "medium",
              bg: "fg.muted/30",
              color: "fg",
              rounded: "md",
              px: "1.5",
            }
          })}>
            Adjust your default reading speed and other settings.
            <br /><br />
            To start, hold down <strong>{triggerHotkey}</strong> and hover your mouse over any text. The words will appear at a rate of <strong>{wordsPerMinute} WPM</strong>. While holding <strong>{triggerHotkey}</strong>, you can also press <strong>{balanceOutwardHotkey}</strong> to expand the selection and include more text.
          </p>
        </div>
        <form className={stack({ gap: '2' })} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            id="wordsPerMinute"
            label="Words Per Minute"
            description="Change the speed at which words are displayed."
            inputType="number"
            inputProps={{
              min: 25,
              step: 25,
              placeholder: String(settings.wordsPerMinute.fallback),
              ...form.register('wordsPerMinute', { required: true, valueAsNumber: true }),
            }}
            form={form}
          />

          <FormField
            id="startDelay"
            label="Start Delay (s)"
            description="Change the delay before the words start to change."
            inputType="number"
            inputProps={{
              min: 0,
              step: 0.1,
              placeholder: String(settings.startDelay.fallback),
              ...form.register('startDelay', { required: true, valueAsNumber: true }),
            }}
            form={form}
          />

          <FormField
            id="punctuationDelay"
            label="End Pause (mult)"
            description="The multiplier for the pause at the end of a sentence. (1.0 = no pause, 2.0 = double pause, this is scaled with WPM)"
            inputType="number"
            inputProps={{
              min: 1,
              step: 0.25,
              placeholder: String(settings.punctuationDelay.fallback),
              ...form.register('punctuationDelay', { required: true, valueAsNumber: true }),
            }}
            form={form}
          />

          <FormField
            id="triggerHotkey"
            label="Trigger Key"
            description="The key to hold down to activate the RSVP."
            inputType="text"
            inputProps={{
              placeholder: settings.triggerHotkey.fallback,
              ...form.register('triggerHotkey', { required: true }),
            }}
            form={form}
          />

          <FormField
            id="balanceOutwardHotkey"
            label="Expand Key"
            description="The key to press while holding the trigger key to expand the selection."
            inputType="text"
            inputProps={{
              placeholder: settings.balanceOutwardHotkey.fallback,
              ...form.register('balanceOutwardHotkey', { required: true }),
            }}
            form={form}
          />

          <FormField
            id="scale"
            label="Scale"
            description="The scale of the RSVP display. (1.0 = 100%, 0.5 = 50%, 2.0 = 200%)"
            inputType="number"
            inputProps={{
              min: 0.1,
              step: 0.25,
              ...form.register('scale', { required: true, valueAsNumber: true }),
            }}
            form={form}
          />

          <FormField
            id="cardBackgroundColor"
            label="Background"
            description="The background color of the RSVP display."
            inputType="text"
            inputProps={{
              placeholder: settings.cardBackgroundColor.fallback,
              ...form.register('cardBackgroundColor', { required: true }),
            }}
            form={form}
          />

          <FormField
            id="cardTextColor"
            label="Text Color"
            description="The text color of the RSVP display."
            inputType="text"
            inputProps={{
              placeholder: settings.cardTextColor.fallback,
              ...form.register('cardTextColor', { required: true }),
            }}
            form={form}
          />

          <FormField
            id="cardAccentColor"
            label="Accent Color"
            description="The accent color of the RSVP display."
            inputType="text"
            inputProps={{
              placeholder: settings.cardAccentColor.fallback,
              ...form.register('cardAccentColor', { required: true }),
            }}
            form={form}
          />
          <FormField
            id="newLineChar"
            label="New Line Char"
            description="The character used to represent new lines in text."
            inputType="text"
            inputProps={{
              placeholder: "empty",
              ...form.register('newLineChar', { required: true }),
            }}
            form={form}
          />
        </form>
        <div className={cx(helperTextStyles, flex({ gap: '1', mt: "2", justify: "space-between" }))}>
          <a href="https://codya.dev" onClick={(e) => openLink(e, "https://codya.dev")} className={css({
            _hover: {
              color: "fg"
            },
            w: "fit"
          })}>
            by Cody Adam
          </a>
          <a href="https://github.com/codyadam/read-it-fast" onClick={(e) => openLink(e, "https://github.com/codyadam/read-it-fast")} className={css({
            _hover: {
              color: "fg"
            },
            w: "fit"
          })}>
            GitHub
          </a>
        </div>

      </div>
    </div>
  );
}

export default App;
