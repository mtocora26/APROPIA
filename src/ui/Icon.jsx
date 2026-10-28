const PATHS = {
  volume: 'M3 9v6h4l5 4V5L7 9H3zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12',
  mute: 'M3 9v6h4l5 4V5L7 9H3zM16 9l5 6M21 9l-5 6',
  lock: 'M5 11h14v9H5zM8 11V7a4 4 0 0 1 8 0v4',
  check: 'M4 12l5 5L20 6',
  play: 'M7 4l13 8-13 8z',
  trophy: 'M7 4h10v6a5 5 0 0 1-10 0zM7 6H3v2a3 3 0 0 0 4 3M17 6h4v2a3 3 0 0 1-4 3M12 15v4M8 20h8',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  back: 'M20 12H5M11 5l-7 7 7 7',
  forward: 'M4 12h15M13 5l7 7-7 7',
}

/** Line icon: 1.75px stroke, square joins. Decorative; the text next to it says what it means. */
function Icon({ name, size = 20 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

export default Icon
