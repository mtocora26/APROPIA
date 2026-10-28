/** Highlights the last word of a title: the highlighter marks the keyword. */
function MarkLast({ text }) {
  const cut = text.lastIndexOf(' ')
  if (cut === -1) return <span className="mark">{text}</span>
  return (
    <>
      {text.slice(0, cut + 1)}
      <span className="mark">{text.slice(cut + 1)}</span>
    </>
  )
}

export default MarkLast
