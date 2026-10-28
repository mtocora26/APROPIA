import './hud.css'

/** Panel. With `featured`, it carries the four sight marks: the one thing to look at on the screen. */
function Panel({ as: Tag = 'div', featured = false, className = '', children, ...rest }) {
  return (
    <Tag className={`panel${featured ? ' panel--featured' : ''} ${className}`.trim()} {...rest}>
      {featured && (
        <>
          <i className="panel__mark panel__mark--tl" aria-hidden="true" />
          <i className="panel__mark panel__mark--tr" aria-hidden="true" />
          <i className="panel__mark panel__mark--bl" aria-hidden="true" />
          <i className="panel__mark panel__mark--br" aria-hidden="true" />
        </>
      )}
      {children}
    </Tag>
  )
}

export default Panel
