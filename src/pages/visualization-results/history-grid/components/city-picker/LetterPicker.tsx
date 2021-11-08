import { memo } from 'react'

interface LetterPickerProps {
  letters: string[]
  onSelect: (value: string) => void
}

const LetterPicker = ({ letters, onSelect }: LetterPickerProps) => {
  return (
    <div>
      <span>首字母：</span>
      {letters.map((l) => (
        <span
          onClick={() => onSelect(l)}
          style={{ marginRight: '.5rem', padding: '0 .1rem', cursor: 'pointer' }}
          key={l}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

export default memo(LetterPicker)
