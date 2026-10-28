/** "A" made of an arch and a highlighter bar, plus the wordmark. */
function Logo() {
  return (
    <span className="logo">
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="38" width="56" height="12" fill="var(--accent)" />
        <path d="M14 56V30a18 18 0 0 1 36 0v26" fill="none" stroke="var(--ink)" strokeWidth="10" />
      </svg>
      <span className="logo__word">APROPIA</span>
    </span>
  )
}

export default Logo
