import domePurify from 'dompurify'

export const domStringPurify = (domString: string) => {
  return domePurify.sanitize(domString)
}
