import { css, cx } from '@/styled-system/css';
import { stack, flex } from '@/styled-system/patterns';
import { useSettings, settings } from '@/hooks/useSettings';

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

// Form styles
const formFieldStyles = flex({
  gap: '1rem',
  alignItems: 'center',
});

const labelStyles = css({
  fontWeight: 'medium',
  flexShrink: 0,
  fontSize: 'sm',
});

const inputStyles = css({
  width: '80px',
  padding: '0.25rem',
  border: '1px solid',
  borderColor: 'fg.muted',
  borderRadius: 'md',
  fontSize: 'medium',
  color: 'fg',
  ml: "auto",
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
  ml: "auto",
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

// Helper text styles
const helperTextStyles = css({
  color: 'fg.muted',
  fontSize: 'sm',
});

function App() {
  const { value: wordsPerMinute, loading, setValue: setWordsPerMinute } = useSettings(settings.wordsPerMinute);
  const { value: startDelay, setValue: setStartDelay } = useSettings(settings.startDelay);
  const { value: triggerHotkey, setValue: setTriggerHotkey } = useSettings(settings.triggerHotkey);
  const { value: balanceOutwardHotkey, setValue: setBalanceOutwardHotkey } = useSettings(settings.balanceOutwardHotkey);
  const { value: scale, setValue: setScale } = useSettings(settings.scale);
  const { value: cardBackgroundColor, setValue: setCardBackgroundColor } = useSettings(settings.cardBackgroundColor);
  const { value: cardTextColor, setValue: setCardTextColor } = useSettings(settings.cardTextColor);
  const { value: cardAccentColor, setValue: setCardAccentColor } = useSettings(settings.cardAccentColor);
  const { value: punctuationDelay, setValue: setPunctuationDelay } = useSettings(settings.punctuationDelay);
  const { value: newLineChar, setValue: setNewLineChar } = useSettings(settings.newLineChar);

  const handleWpmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    const safeVal = Number.isNaN(newVal) ? 200 : newVal;
    await setWordsPerMinute(safeVal);
  };

  const handleStartDelayChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    const safeVal = Number.isNaN(newVal) ? 0.5 : newVal;
    await setStartDelay(safeVal);
  };

  const handleTriggerHotkeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setTriggerHotkey(e.target.value || "Meta");
  };

  const handleBalanceOutwardHotkeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setBalanceOutwardHotkey(e.target.value || "Shift");
  };

  const handleScaleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    const safeVal = Number.isNaN(newVal) ? 1.0 : newVal;
    await setScale(safeVal);
  };

  const handleCardBackgroundColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setCardBackgroundColor(e.target.value || "#000000f0");
  };

  const handleCardTextColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setCardTextColor(e.target.value || "#FFFFFF");
  };

  const handleCardAccentColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setCardAccentColor(e.target.value || "#FB2C36");
  };

  const handlePunctuationDelayChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    const safeVal = Number.isNaN(newVal) ? 3.0 : newVal;
    await setPunctuationDelay(safeVal);
  };

  const handleNewLineCharChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const singleChar = input.length > 0 ? input[input.length - 1] : "";
    await setNewLineChar(singleChar);
  };

  const openLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault(); // Prevent default anchor behavior
    browser.tabs.create({ url: url });
  };

  return (
    <div className={containerStyles}>
      <div className={stack({ gap: '6' })}>
        <h1 className={titleStyles}>Read It Fast</h1>
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
        <div className={stack({ gap: '2' })}>
          <div className={formFieldStyles}>
            <label htmlFor="wpm" className={labelStyles}>
              Words Per Minute
            </label>
            <input
              id="wpm"
              type="number"
              min={1}
              max={9999}
              value={loading ? '' : wordsPerMinute.toString()}
              disabled={loading}
              onChange={handleWpmChange}
              className={inputStyles}
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="startDelay" className={labelStyles}>
              Start Delay (s)
            </label>
            <input
              id="startDelay"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={loading ? '' : startDelay.toString()}
              disabled={loading}
              onChange={handleStartDelayChange}
              className={inputStyles}
            />
          </div>
          <div className={formFieldStyles}>
            <label htmlFor="punctuationDelay" className={labelStyles}>
              End Pause (mult)
            </label>
            <input
              id="punctuationDelay"
              type="number"
              min={1}
              max={20}
              step={0.1}
              value={loading ? '' : punctuationDelay.toString()}
              disabled={loading}
              onChange={handlePunctuationDelayChange}
              className={inputStyles}
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="triggerHotkey" className={labelStyles}>
              Trigger Key
            </label>
            <input
              id="triggerHotkey"
              type="text"
              value={loading ? '' : triggerHotkey}
              disabled={loading}
              onChange={handleTriggerHotkeyChange}
              className={textInputStyles}
              placeholder="Meta"
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="balanceOutwardHotkey" className={labelStyles}>
              Expand Key
            </label>
            <input
              id="balanceOutwardHotkey"
              type="text"
              value={loading ? '' : balanceOutwardHotkey}
              disabled={loading}
              onChange={handleBalanceOutwardHotkeyChange}
              className={textInputStyles}
              placeholder="Shift"
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="scale" className={labelStyles}>
              Scale
            </label>
            <input
              id="scale"
              type="number"
              min={0.1}
              max={5}
              step={0.1}
              value={loading ? '' : scale.toString()}
              disabled={loading}
              onChange={handleScaleChange}
              className={inputStyles}
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="cardBackgroundColor" className={labelStyles}>
              Background
            </label>
            <input
              id="cardBackgroundColor"
              type="text"
              value={loading ? '' : cardBackgroundColor}
              disabled={loading}
              onChange={handleCardBackgroundColorChange}
              className={textInputStyles}
              placeholder="#000000f0"
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="cardTextColor" className={labelStyles}>
              Text Color
            </label>
            <input
              id="cardTextColor"
              type="text"
              value={loading ? '' : cardTextColor}
              disabled={loading}
              onChange={handleCardTextColorChange}
              className={textInputStyles}
              placeholder="#FFFFFF"
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="cardAccentColor" className={labelStyles}>
              Accent Color
            </label>
            <input
              id="cardAccentColor"
              type="text"
              value={loading ? '' : cardAccentColor}
              disabled={loading}
              onChange={handleCardAccentColorChange}
              className={textInputStyles}
              placeholder="#FB2C36"
            />
          </div>

          <div className={formFieldStyles}>
            <label htmlFor="newLineChar" className={labelStyles}>
              New Line Char
            </label>
            <input
              id="newLineChar"
              type="text"
              value={loading ? '' : newLineChar}
              disabled={loading}
              onChange={handleNewLineCharChange}
              className={textInputStyles}
              placeholder="empty"
            />
          </div>



        </div>
        <div className={cx(helperTextStyles, flex({ gap: '1', justify: "space-between" }))}>
          <a href='https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation' onClick={(e) => openLink(e, "https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation")} className={css({
            _hover: {
              color: "fg"
            },
            w: "fit"
          })}>
            What is RSVP?
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
