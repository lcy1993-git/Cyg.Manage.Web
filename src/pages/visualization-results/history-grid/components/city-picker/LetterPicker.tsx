import { memo } from 'react'

type LetterPickerProps = {
  letters: string[]
  onSelect: (value: string) => void
}

const LetterPicker = ({ letters, onSelect }: LetterPickerProps) => {
  return (
    <div
      style={{
        padding: '.3rem 0 .3rem .5rem',
        border: '#DBDBDB',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    >
      <span style={{ color: '#505050' }}>首字母：</span>
      <span style={{ color: '#0E7B3B', backgroundColor: '#E4F5EB', marginRight: '.4rem' }}>#</span>
      {letters.map((l) => (
        <span
          onClick={() => onSelect(l)}
          style={{ marginRight: '.4rem', padding: '0 .1rem', cursor: 'pointer', color: '#1F1F1F' }}
          key={l}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

export default memo(LetterPicker)
