import { memo } from 'react'

type LetterPickerProps = {
  letters: string[]
  onSelect: (value: string) => void
}

const LetterPicker = ({ letters, onSelect }: LetterPickerProps) => {
  return (
    <div className="pl-2 py-1 border border-gray-300 border-solid border-l-0 border-r-0">
      <span className="text-gray-600">首字母：</span>
      {letters.map((l) => (
        <span onClick={() => onSelect(l)} className="mr-2 cursor-pointer text-gray-900" key={l}>
          {l.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

export default memo(LetterPicker)
