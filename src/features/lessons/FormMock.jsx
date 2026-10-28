import './formMock.css'

const KIND_LABELS = {
  label: 'Label',
  textbox: 'TextBox',
  button: 'Button',
  checkbox: 'CheckBox',
  listbox: 'ListBox',
  combobox: 'ComboBox',
}

/**
 * Dibujo de un formulario de Windows Forms con sus controles y sus Name, para
 * enseñar qué hay en la ventana sin abrir Visual Studio. No es interactivo.
 * Posiciones en píxeles dentro de `width` × `height`; se escalan con el ancho.
 */
function FormMock({ block }) {
  const { title, width, height, controls } = block
  const description = controls
    .map((control) => `${KIND_LABELS[control.kind]} ${control.name}${control.text ? ` con texto «${control.text}»` : ''}`)
    .join('; ')

  return (
    <figure className="form-mock" style={{ '--form-w': `${width}px`, '--font-ratio': 14 / width }} aria-label={`Formulario «${title}»: ${description}`}>
      <div className="form-mock__window">
        <div className="form-mock__titlebar" aria-hidden="true">
          <span>{title}</span>
          <span className="form-mock__chrome">–  □  ✕</span>
        </div>
        <div className="form-mock__canvas" style={{ aspectRatio: `${width} / ${height}` }} aria-hidden="true">
          {controls.map((control) => (
            <div
              key={control.name}
              className="form-mock__slot"
              style={{
                left: `${(control.x / width) * 100}%`,
                top: `${(control.y / height) * 100}%`,
                width: `${(control.w / width) * 100}%`,
                height: `${(control.h / height) * 100}%`,
              }}
            >
              <Control control={control} />
              <span className="form-mock__name">{control.name}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="form-mock__caption">Debajo de cada control, en gris, su Name.</figcaption>
    </figure>
  )
}

function Control({ control }) {
  switch (control.kind) {
    case 'label':
      return <span className="form-mock__label">{control.text}</span>
    case 'textbox':
      return <span className="form-mock__box">{control.text}</span>
    case 'button':
      return <span className="form-mock__button">{control.text}</span>
    case 'checkbox':
      return (
        <span className="form-mock__check">
          <i className={control.checked ? 'form-mock__tick form-mock__tick--on' : 'form-mock__tick'} />
          {control.text}
        </span>
      )
    case 'combobox':
      return <span className="form-mock__box form-mock__combo">{control.text}<i>▾</i></span>
    case 'listbox':
      return (
        <span className="form-mock__box form-mock__list">
          {(control.items ?? []).map((item) => <em key={item}>{item}</em>)}
        </span>
      )
    default:
      return null
  }
}

export default FormMock
