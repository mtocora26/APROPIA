// Windows Forms con C#. Continúa el curso de PSeInt: la misma lógica (decisiones, ciclos,
// acumuladores) ahora dentro de una ventana. No hay editor de C# en la plataforma: el
// código se practica en Visual Studio; aquí se explica, se predice y se ordena.
// El C# de este archivo no se compila en las pruebas del repositorio: revisarlo en
// Visual Studio antes de la tutoría.
const code = (...rows) => rows.join('\n')

const form = (title, width, height, controls) => ({ type: 'form', title, width, height, controls })

export const WINFORMS_CSHARP = {
  id: 'winforms-csharp',
  title: 'Windows Forms · C#',
  language: 'es',
  level: 'Fundamentos',
  modules: [
    {
      id: 'wf-ventana',
      title: 'La ventana y sus controles',
      lessons: [
        {
          id: 'wf-primer-formulario',
          title: 'Tu primer formulario',
          tutorNotes: [
            'Crear el proyecto: Visual Studio → Crear un proyecto → «Aplicación de Windows Forms» (C#, .NET). Si no aparece, falta instalar la carga de trabajo «Desarrollo de escritorio con .NET».',
            'Ventanas que necesitan ver: Cuadro de herramientas (Ver → Cuadro de herramientas) para arrastrar controles, y Propiedades (F4) para cambiar Name y Text.',
            'Demo de 5 minutos: arrastren un Label, un TextBox y un Button; cambien Text del botón y Name a btnSaludar; ejecuten con F5. Todavía no hace nada: eso es normal y es la mejor entrada a la lección de eventos.',
            'Form1.Designer.cs lo escribe Visual Studio; no se edita a mano. El código propio va en Form1.cs.',
          ],
          theory: [
            { type: 'text', text: 'Windows Forms (WinForms) sirve para hacer programas con ventanas. La ventana es el formulario (Form); sobre él pones controles: etiquetas (Label), cajas de texto (TextBox), botones (Button), listas (ListBox)… Cada control tiene propiedades (cómo se ve y qué guarda) y eventos (cosas que le pasan: un clic, un cambio de texto).' },
            form('Sumar dos números', 420, 200, [
              { kind: 'label', name: 'lblA', text: 'Primer número:', x: 20, y: 20, w: 120, h: 24 },
              { kind: 'textbox', name: 'txtA', text: '4', x: 150, y: 18, w: 120, h: 26 },
              { kind: 'label', name: 'lblB', text: 'Segundo número:', x: 20, y: 66, w: 125, h: 24 },
              { kind: 'textbox', name: 'txtB', text: '5', x: 150, y: 64, w: 120, h: 26 },
              { kind: 'button', name: 'btnSumar', text: 'Sumar', x: 290, y: 40, w: 100, h: 32 },
              { kind: 'label', name: 'lblResultado', text: 'Resultado: —', x: 20, y: 120, w: 250, h: 24 },
            ]),
            { type: 'table', columns: ['Control', 'Para qué sirve', 'Propiedad que más usarás'], rows: [['Label', 'Mostrar texto al usuario', 'Text'], ['TextBox', 'Que el usuario escriba un dato', 'Text'], ['Button', 'Ejecutar una acción al hacer clic', 'Text y el evento Click'], ['ListBox', 'Mostrar varios elementos', 'Items'], ['CheckBox', 'Marcar sí o no', 'Checked'], ['ComboBox', 'Elegir una opción de una lista', 'SelectedItem']] },
            { type: 'text', text: 'Cada control tiene dos nombres distintos. Text es lo que ve el usuario; Name es como lo llamas en el código. Ponle a Name un prefijo que diga qué es y una palabra que diga para qué: txtNota, btnCalcular, lblResultado. Se cambia en la ventana Propiedades (F4).' },
            { type: 'code', lang: 'csharp', text: code('// Form1.cs: aquí va tu código', 'public partial class Form1 : Form', '{', '    public Form1()', '    {', '        InitializeComponent();   // crea los controles que dibujaste', '    }', '}') },
            { type: 'tip', text: 'El Diseñador y el código son dos vistas del mismo formulario: lo que arrastras, Visual Studio lo escribe por ti en Form1.Designer.cs. Tu código va en Form1.cs. Cambia Name antes de programar, no después, para no romper referencias.' },
          ],
          exercises: [
            { id: 'wf-1-1', type: 'choice', prompt: 'Quieres que el usuario escriba su nombre y que otra parte de la ventana lo muestre. ¿Qué controles usas?', options: ['Un TextBox para escribirlo y un Label para mostrarlo', 'Dos Button', 'Un ListBox para escribirlo y un CheckBox para mostrarlo'], answer: 'Un TextBox para escribirlo y un Label para mostrarlo', explanation: 'Para que el usuario escriba, TextBox; para mostrar un texto sin que lo cambie, Label.' },
            { id: 'wf-1-2', type: 'choice', prompt: '¿Qué propiedad cambia el texto que se ve en un botón?', options: ['Text', 'Name', 'Items'], answer: 'Text', explanation: 'Text es lo que ve el usuario; Name es el nombre que usas en el código.' },
            { id: 'wf-1-3', type: 'choice', prompt: '¿Cuál es un buen Name para el TextBox donde se escribe la edad?', options: ['txtEdad', 'textBox1', 'edad texto'], answer: 'txtEdad', explanation: 'Prefijo de tipo + palabra de propósito, sin espacios. textBox1 funciona, pero no dice nada al leer el código.' },
            { id: 'wf-1-4', type: 'choice', prompt: '¿En qué archivo escribes tu código del formulario?', options: ['Form1.cs', 'Form1.Designer.cs'], answer: 'Form1.cs', explanation: 'Form1.Designer.cs lo genera Visual Studio con lo que arrastras.' },
            { id: 'wf-1-5', type: 'typed', prompt: '¿Qué propiedad de un TextBox contiene lo que el usuario escribió?', answer: 'Text', alternatives: ['.Text', 'txt.Text'] },
            { id: 'wf-1-6', type: 'reorder', prompt: 'Ordena los pasos para armar un formulario que haga algo.', tokens: ['Arrastrar los controles al formulario', 'Cambiar Name y Text en Propiedades', 'Doble clic en el botón', 'Escribir el código del evento', 'Ejecutar con F5'], answer: ['Arrastrar los controles al formulario', 'Cambiar Name y Text en Propiedades', 'Doble clic en el botón', 'Escribir el código del evento', 'Ejecutar con F5'] },
          ],
        },
        {
          id: 'wf-eventos',
          title: 'Eventos: que pase algo al hacer clic',
          tutorNotes: [
            'Idea central para el grupo: un programa de consola corre de arriba abajo; uno con ventanas espera. Pregunten: «¿qué hace el programa mientras nadie toca nada?» (nada).',
            'Demo: doble clic sobre btnSaludar crea btnSaludar_Click. Escriban dentro de las llaves lblMensaje.Text = "Hola, " + txtNombre.Text; y ejecuten.',
            'Error clásico de laboratorio: borrar a mano el método del clic. El proyecto deja de compilar porque Form1.Designer.cs sigue apuntando a él. Solución: Ctrl+Z, o quitar el evento en Propiedades → Eventos (el rayo).',
            'object sender, EventArgs e: no hay que explicarlos hoy. Basta con «son parámetros que Visual Studio pone; por ahora los dejamos como están».',
          ],
          theory: [
            { type: 'text', text: 'Un programa de consola corre de arriba hacia abajo. Uno con ventanas espera: no hace nada hasta que el usuario hace algo. Eso que pasa se llama evento (Click, TextChanged, Load…). El código que responde a un evento se llama manejador de eventos.' },
            form('Saludar', 380, 150, [
              { kind: 'label', name: 'lblNombre', text: 'Tu nombre:', x: 20, y: 22, w: 90, h: 24 },
              { kind: 'textbox', name: 'txtNombre', text: 'Ana', x: 115, y: 20, w: 150, h: 26 },
              { kind: 'button', name: 'btnSaludar', text: 'Saludar', x: 275, y: 18, w: 85, h: 30 },
              { kind: 'label', name: 'lblMensaje', text: 'Hola, Ana', x: 20, y: 80, w: 250, h: 24 },
            ]),
            { type: 'code', lang: 'csharp', text: code('private void btnSaludar_Click(object sender, EventArgs e)', '{', '    lblMensaje.Text = "Hola, " + txtNombre.Text;', '}') },
            { type: 'table', columns: ['Qué pasa', 'Qué se ejecuta'], rows: [['El usuario escribe «Ana» en txtNombre', 'Nada de tu código; txtNombre.Text ahora vale "Ana"'], ['El usuario hace clic en btnSaludar', 'Se ejecuta btnSaludar_Click'], ['Se lee txtNombre.Text', 'Da "Ana"'], ['Se asigna a lblMensaje.Text', 'La etiqueta muestra «Hola, Ana»']] },
            { type: 'text', text: 'Para crear el manejador, haz doble clic sobre el botón en el Diseñador: Visual Studio crea el método vacío y lo conecta al evento; tú solo escribes entre las llaves. Si borras ese método a mano, el proyecto deja de compilar.' },
            { type: 'tip', text: 'En C#, = asigna (como <- en PSeInt) y == compara (como = en PSeInt). El + entre textos los une: "Hola, " + "Ana" da "Hola, Ana".' },
          ],
          classExercises: [
            { id: 'wf-clase-2-1', type: 'choice', prompt: 'Votación: ¿cuándo se ejecuta btnSaludar_Click?', options: ['Al abrir el programa', 'Cuando el usuario hace clic en btnSaludar', 'Cuando se escribe en txtNombre'], answer: 'Cuando el usuario hace clic en btnSaludar' },
            { id: 'wf-clase-2-2', type: 'choice', prompt: 'El usuario escribe «Luis» y hace clic. ¿Qué muestra lblMensaje?', options: ['Hola, Luis', 'Hola, txtNombre.Text', 'Hola, Ana'], answer: 'Hola, Luis', explanation: 'txtNombre.Text se evalúa al momento del clic: vale lo que haya escrito en ese instante.' },
            { id: 'wf-clase-2-3', type: 'open', code: true, classInstruction: 'En Visual Studio, juntos: creen el formulario de la figura y programen btnSaludar. Luego comparen con el modelo.', prompt: 'Programen el clic de btnSaludar para que lblMensaje diga «Hola, » y el nombre escrito.', hints: ['Doble clic en el botón crea el método.', 'lblMensaje.Text = ...'], modelAnswer: code('private void btnSaludar_Click(object sender, EventArgs e)', '{', '    lblMensaje.Text = "Hola, " + txtNombre.Text;', '}') },
          ],
          exercises: [
            { id: 'wf-2-1', type: 'choice', prompt: '¿Cuándo se ejecuta btnSaludar_Click?', options: ['Cuando el usuario hace clic en btnSaludar', 'Cuando se abre el formulario', 'Todo el tiempo, en bucle'], answer: 'Cuando el usuario hace clic en btnSaludar', explanation: 'Un programa con ventanas espera eventos; el manejador solo corre cuando ocurre su evento.' },
            { id: 'wf-2-2', type: 'typed', prompt: '¿Cómo se llama el evento de un botón cuando lo presionan?', answer: 'Click' },
            { id: 'wf-2-3', type: 'choice', prompt: 'Programaste btnSaludar_Click, pero al hacer clic no pasa nada. ¿Cuál es la causa más probable?', options: ['El método no está conectado al evento Click del botón (por ejemplo, se escribió a mano en vez de crearlo con doble clic)', 'Falta un Label en el formulario', 'El formulario no tiene título'], answer: 'El método no está conectado al evento Click del botón (por ejemplo, se escribió a mano en vez de crearlo con doble clic)', explanation: 'Un método solo responde a un evento si está conectado. El doble clic en el botón hace esa conexión por ti.' },
            { id: 'wf-2-4', type: 'choice', prompt: 'Si el usuario escribe «Luis» y hace clic, ¿qué muestra lblMensaje?', options: ['Hola, Luis', 'Hola, txtNombre.Text', 'Hola, '], answer: 'Hola, Luis' },
            { id: 'wf-2-5', type: 'choice', prompt: '¿Cuál es la forma más rápida de crear el método del clic?', options: ['Doble clic sobre el botón en el Diseñador', 'Copiarlo de internet', 'Escribirlo en Form1.Designer.cs'], answer: 'Doble clic sobre el botón en el Diseñador' },
            { id: 'wf-2-6', type: 'reorder', prompt: 'Ordena el manejador del clic.', tokens: ['private void btnSaludar_Click(object sender, EventArgs e)', '{', 'lblMensaje.Text = "Hola, " + txtNombre.Text;', '}'], answer: ['private void btnSaludar_Click(object sender, EventArgs e)', '{', 'lblMensaje.Text = "Hola, " + txtNombre.Text;', '}'] },
          ],
        },
      ],
    },
    {
      id: 'wf-logica',
      title: 'La lógica de PSeInt, ahora en C#',
      lessons: [
        {
          id: 'wf-datos',
          title: 'Leer números y mostrar resultados',
          tutorNotes: [
            'Conexión con lo que ya saben: Leer de PSeInt = leer txt.Text y convertir; Escribir = poner el valor en una Label o un MessageBox.',
            'Demostración que sorprende: txtA = 4 y txtB = 5 sin convertir da «45», no 9. Quítenle la conversión al código del sumador y ejecuten.',
            'Decimales: en Colombia el separador de Windows suele ser la coma. Si double.Parse falla con «2.5», prueben «2,5». No es un error del código.',
            'Si alguien deja una caja vacía, int.Parse lanza FormatException y el programa se cierra. Es el momento natural para mostrar TryParse.',
          ],
          theory: [
            { type: 'text', text: 'Todo lo que el usuario escribe en un TextBox es texto (string), incluso si escribe 25. Para calcular hay que convertirlo a número. Es el equivalente de Leer en PSeInt: aquí el dato sale de txt.Text y se convierte al tipo que necesitas.' },
            form('Sumar dos números', 420, 200, [
              { kind: 'label', name: 'lblA', text: 'Primer número:', x: 20, y: 20, w: 120, h: 24 },
              { kind: 'textbox', name: 'txtA', text: '4', x: 150, y: 18, w: 120, h: 26 },
              { kind: 'label', name: 'lblB', text: 'Segundo número:', x: 20, y: 66, w: 125, h: 24 },
              { kind: 'textbox', name: 'txtB', text: '5', x: 150, y: 64, w: 120, h: 26 },
              { kind: 'button', name: 'btnSumar', text: 'Sumar', x: 290, y: 40, w: 100, h: 32 },
              { kind: 'label', name: 'lblResultado', text: 'Resultado: 9', x: 20, y: 120, w: 250, h: 24 },
            ]),
            { type: 'code', lang: 'csharp', text: code('private void btnSumar_Click(object sender, EventArgs e)', '{', '    int a = int.Parse(txtA.Text);', '    int b = int.Parse(txtB.Text);', '    int suma = a + b;', '    lblResultado.Text = "Resultado: " + suma;', '}') },
            { type: 'table', columns: ['En PSeInt', 'En Windows Forms (C#)'], rows: [['Leer edad (Entero)', 'int edad = int.Parse(txtEdad.Text);'], ['Leer nota (Real)', 'double nota = double.Parse(txtNota.Text);'], ['Escribir x', 'lblResultado.Text = x.ToString();'], ['Escribir "Hola"', 'MessageBox.Show("Hola");']] },
            { type: 'text', text: 'Si el usuario deja la caja vacía o escribe letras, int.Parse lanza un error y el programa se cierra. La forma segura es TryParse: devuelve verdadero si pudo convertir y guarda el número en la variable.' },
            { type: 'code', lang: 'csharp', text: code('int a;', 'if (int.TryParse(txtA.Text, out a))', '{', '    lblResultado.Text = "Doble: " + (a * 2);', '}', 'else', '{', '    MessageBox.Show("Escribe un número entero.");', '}') },
            { type: 'tip', text: 'Con decimales, el separador depende de la configuración de Windows: puede ser coma (2,5) o punto (2.5). Prueba con el que use tu equipo.' },
          ],
          exercises: [
            { id: 'wf-3-1', type: 'choice', prompt: '¿De qué tipo es el valor de txtA.Text, aunque el usuario escriba 25?', options: ['string (texto)', 'int (entero)', 'double (real)'], answer: 'string (texto)', explanation: 'Un TextBox siempre entrega texto. Hay que convertirlo para calcular.' },
            { id: 'wf-3-2', type: 'choice', prompt: '¿Qué instrucción convierte lo escrito en txtEdad a un entero?', options: ['int.Parse(txtEdad.Text)', 'txtEdad.Int', 'Leer txtEdad'], answer: 'int.Parse(txtEdad.Text)' },
            { id: 'wf-3-3', type: 'choice', prompt: 'Tu compañero escribe lblResultado.Text = \'Hola\'; y no compila. ¿Qué debe cambiar?', options: ['El texto va entre comillas dobles: "Hola"', 'Debe usar int.Parse', 'Un Label no tiene la propiedad Text'], answer: 'El texto va entre comillas dobles: "Hola"', explanation: 'En C#, las comillas simples son para un solo carácter. Los textos van con comillas dobles.' },
            { id: 'wf-3-4', type: 'typed', prompt: 'txtA = 4 y txtB = 5. Con int.Parse en ambos, ¿qué número muestra lblResultado al sumar?', answer: '9' },
            { id: 'wf-3-5', type: 'choice', prompt: 'txtA = 4 y txtB = 5. ¿Qué da txtA.Text + txtB.Text, sin convertir?', options: ['45', '9', 'Un error'], answer: '45', explanation: 'El + entre textos los une. 4 y 5 son caracteres, no números.' },
            { id: 'wf-3-6', type: 'choice', prompt: '¿Qué pasa con int.Parse("hola")?', options: ['Lanza un error y el programa se cierra', 'Devuelve 0', 'Devuelve "hola"'], answer: 'Lanza un error y el programa se cierra', explanation: 'Por eso se usa TryParse cuando el dato puede venir mal.' },
            { id: 'wf-3-7', type: 'reorder', prompt: 'Ordena el manejador que suma dos números.', tokens: ['int a = int.Parse(txtA.Text);', 'int b = int.Parse(txtB.Text);', 'int suma = a + b;', 'lblResultado.Text = "Resultado: " + suma;'], answer: ['int a = int.Parse(txtA.Text);', 'int b = int.Parse(txtB.Text);', 'int suma = a + b;', 'lblResultado.Text = "Resultado: " + suma;'] },
          ],
        },
        {
          id: 'wf-decisiones',
          title: 'Decisiones y validación',
          tutorNotes: [
            'Lo más útil de hoy es la tabla de equivalencias: si el estudiante sabe PSeInt, ya sabe esto; solo cambian los símbolos.',
            'Error número uno: usar = para comparar (en PSeInt sí se puede). En C# = asigna y == compara.',
            'Otro clásico: olvidar las llaves y que el segundo renglón del if quede «fuera». Recomienden usar llaves siempre.',
            'En C# la condición lleva paréntesis y no hay Entonces ni FinSi.',
          ],
          theory: [
            { type: 'text', text: 'La lógica es la misma que en PSeInt; solo cambian los símbolos. Si ya sabes validar un rango con Y y O, ya sabes hacerlo aquí.' },
            { type: 'table', columns: ['PSeInt', 'C#'], rows: [['Si condición Entonces … Sino … FinSi', 'if (condición) { … } else { … }'], ['Y', '&&'], ['O', '||'], ['NO', '!'], ['= (comparar)', '=='], ['<> (distinto)', '!='], ['<- (asignar)', '='], ['Mientras … Hacer', 'while (condición) { … }'], ['Repetir … Hasta Que cond', 'do { … } while (!cond);'], ['Para i <- 1 Hasta n', 'for (int i = 1; i <= n; i++)']] },
            form('Validar nota', 360, 160, [
              { kind: 'label', name: 'lblNota', text: 'Nota (0 a 5):', x: 20, y: 22, w: 100, h: 24 },
              { kind: 'textbox', name: 'txtNota', text: '6', x: 125, y: 20, w: 90, h: 26 },
              { kind: 'button', name: 'btnVerificar', text: 'Verificar', x: 230, y: 18, w: 100, h: 30 },
              { kind: 'label', name: 'lblEstado', text: '', x: 20, y: 80, w: 250, h: 24 },
            ]),
            { type: 'code', lang: 'csharp', text: code('private void btnVerificar_Click(object sender, EventArgs e)', '{', '    double nota = double.Parse(txtNota.Text);', '    if (nota >= 0 && nota <= 5)', '    {', '        if (nota >= 3)', '            lblEstado.Text = "Aprueba";', '        else', '            lblEstado.Text = "No aprueba";', '    }', '    else', '    {', '        MessageBox.Show("La nota debe estar entre 0 y 5.");', '    }', '}') },
            { type: 'tip', text: 'Rango válido con &&; fuera de rango con ||: nota < 0 || nota > 5. Prueba siempre -1, 0, 5 y 6. Con nota = 6, el programa de arriba muestra el mensaje de error y no toca lblEstado.' },
          ],
          exercises: [
            { id: 'wf-4-1', type: 'choice', prompt: 'Escribes if (nota = 3) para saber si la nota es 3. ¿Qué pasa?', options: ['No compila: = asigna, y para comparar hay que usar ==', 'Funciona igual que en PSeInt', 'Compila, pero siempre es falso'], answer: 'No compila: = asigna, y para comparar hay que usar ==', explanation: 'En PSeInt = compara; en C# = asigna y == compara. Es el error de traducción más común.' },
            { id: 'wf-4-2', type: 'choice', prompt: '¿Cómo se escribe en C# «edad entre 18 y 65, inclusive»?', options: ['edad >= 18 && edad <= 65', 'edad >= 18 || edad <= 65', '18 <= edad <= 65'], answer: 'edad >= 18 && edad <= 65' },
            { id: 'wf-4-3', type: 'choice', prompt: '¿Cuál detecta una nota fuera de 0 a 5?', options: ['nota < 0 || nota > 5', 'nota < 0 && nota > 5', 'nota >= 0 && nota <= 5'], answer: 'nota < 0 || nota > 5', explanation: 'Con &&, ninguna nota sería menor que 0 y mayor que 5 a la vez.' },
            { id: 'wf-4-4', type: 'choice', prompt: '¿Cómo preguntas en C# si x vale 3?', options: ['x == 3', 'x = 3', 'x <- 3'], answer: 'x == 3', explanation: 'En C#, = asigna y == compara.' },
            { id: 'wf-4-5', type: 'choice', prompt: 'Con txtNota = 6, ¿qué hace el programa de la lección?', options: ['Muestra el mensaje de error', 'Escribe «Aprueba»', 'Escribe «No aprueba»'], answer: 'Muestra el mensaje de error' },
            { id: 'wf-4-6', type: 'typed', prompt: '¿Qué operador de C# equivale a la Y de PSeInt?', answer: '&&' },
            { id: 'wf-4-7', type: 'reorder', prompt: 'Ordena el if con else.', tokens: ['if (nota >= 3)', 'lblEstado.Text = "Aprueba";', 'else', 'lblEstado.Text = "No aprueba";'], answer: ['if (nota >= 3)', 'lblEstado.Text = "Aprueba";', 'else', 'lblEstado.Text = "No aprueba";'] },
          ],
        },
        {
          id: 'wf-ciclos',
          title: 'Ciclos y listas',
          tutorNotes: [
            'Diferencia importante con PSeInt: en for, la condición se escribe completa. Contar hacia atrás no se hace con «Paso -1»: es for (int i = 3; i >= 1; i--) y la condición cambia a >=.',
            'ListBox.Items.Add agrega una fila; Items.Clear la borra. Sin Clear, cada clic repite las filas.',
            'Demo: tabla del 3. El resultado se ve enseguida en la lista y es más visual que la consola.',
          ],
          theory: [
            { type: 'text', text: 'Los ciclos son los mismos de PSeInt. Con ventanas se usan, por ejemplo, para llenar una ListBox o procesar varios datos. Items.Add agrega una fila a la lista; Items.Clear la deja vacía.' },
            form('Tabla de multiplicar', 380, 250, [
              { kind: 'label', name: 'lblN', text: 'Número:', x: 20, y: 22, w: 70, h: 24 },
              { kind: 'textbox', name: 'txtN', text: '3', x: 95, y: 20, w: 70, h: 26 },
              { kind: 'button', name: 'btnGenerar', text: 'Generar', x: 180, y: 18, w: 90, h: 30 },
              { kind: 'listbox', name: 'lstTabla', items: ['3 x 1 = 3', '3 x 2 = 6', '3 x 3 = 9', '3 x 4 = 12'], x: 20, y: 66, w: 160, h: 130 },
            ]),
            { type: 'code', lang: 'csharp', text: code('private void btnGenerar_Click(object sender, EventArgs e)', '{', '    lstTabla.Items.Clear();', '    int n = int.Parse(txtN.Text);', '    for (int i = 1; i <= 10; i++)', '    {', '        lstTabla.Items.Add(n + " x " + i + " = " + (n * i));', '    }', '}') },
            { type: 'table', columns: ['Parte del for', 'Qué hace', 'En PSeInt'], rows: [['int i = 1', 'Valor inicial', 'Para i <- 1'], ['i <= 10', 'Mientras esto sea verdadero, sigue', 'Hasta 10'], ['i++', 'Al final de cada vuelta, suma 1', 'Con Paso 1']] },
            { type: 'tip', text: 'i++ suma 1; i-- resta 1; i += 2 suma de 2 en 2. Para contar hacia atrás: for (int i = 3; i >= 1; i--). A diferencia de PSeInt, aquí tú escribes la condición completa.' },
          ],
          exercises: [
            { id: 'wf-5-1', type: 'choice', prompt: 'for (int i = 1; i <= 10; i++): ¿cuántas filas agrega Items.Add si está dentro del ciclo?', options: ['10', '9', '11'], answer: '10' },
            { id: 'wf-5-2', type: 'choice', prompt: 'for (int i = 1; i <= 5; i += 2): ¿qué valores toma i?', options: ['1, 3, 5', '1, 2, 3, 4, 5', '1, 3, 5, 7'], answer: '1, 3, 5' },
            { id: 'wf-5-3', type: 'choice', prompt: '¿Qué condición usas en el for para contar 3, 2, 1?', options: ['i >= 1', 'i <= 1', 'i == 1'], answer: 'i >= 1', explanation: 'Como i baja, el ciclo sigue mientras i sea mayor o igual que 1.' },
            { id: 'wf-5-4', type: 'choice', prompt: '¿Qué hace lstTabla.Items.Clear()?', options: ['Borra las filas que ya había', 'Agrega una fila vacía', 'Cierra el formulario'], answer: 'Borra las filas que ya había', explanation: 'Sin esa línea, cada clic en Generar repite la tabla debajo de la anterior.' },
            { id: 'wf-5-5', type: 'choice', prompt: 'Debes repetir una lectura mientras el dato sea distinto de -1, y no sabes cuántas veces. ¿Qué ciclo de C# usas?', options: ['while (nota != -1)', 'for (int i = 1; i <= 10; i++)', 'if (nota != -1)'], answer: 'while (nota != -1)', explanation: 'Cuando no se conoce el número de vueltas se usa while (como Mientras). for es para una cantidad conocida.' },
            { id: 'wf-5-6', type: 'reorder', prompt: 'Ordena el ciclo que llena la lista.', tokens: ['lstTabla.Items.Clear();', 'for (int i = 1; i <= 10; i++)', '{', 'lstTabla.Items.Add(n * i);', '}'], answer: ['lstTabla.Items.Clear();', 'for (int i = 1; i <= 10; i++)', '{', 'lstTabla.Items.Add(n * i);', '}'] },
          ],
        },
      ],
    },
    {
      id: 'wf-proyecto',
      title: 'Proyecto integrador',
      lessons: [{
        id: 'wf-notas-grupo',
        title: 'Notas del grupo: recordar entre clics',
        tutorNotes: [
          'Es el mismo reto final de PSeInt (promedio y aprobados), pero ahora el usuario ingresa una nota por clic. Si el grupo hizo el reto, conectar los dos: «¿qué sería suma y contador aquí?».',
          'Concepto nuevo y difícil: las variables locales desaparecen al terminar el método. Lo que debe recordarse entre clics va fuera de los métodos (campo de la clase). Pregunta de control: «¿qué pasa si declaro suma dentro del clic?».',
          'return dentro de un método void significa «salir de aquí ahora». Se usa para no seguir si la nota es inválida.',
          'Orden sugerido en vivo: primero solo el promedio; después aprobados; al final la validación.',
        ],
        theory: [
          { type: 'text', text: 'Cada vez que el usuario hace clic, el manejador empieza de cero: sus variables locales desaparecen al terminar. Para recordar datos entre clic y clic (la suma, el contador) se declaran fuera de los métodos, al inicio de la clase. Son campos del formulario y viven mientras la ventana esté abierta.' },
          form('Notas del grupo', 460, 280, [
            { kind: 'label', name: 'lblNota', text: 'Nota (0 a 5):', x: 20, y: 22, w: 100, h: 24 },
            { kind: 'textbox', name: 'txtNota', text: '4', x: 125, y: 20, w: 80, h: 26 },
            { kind: 'button', name: 'btnAgregar', text: 'Agregar', x: 220, y: 18, w: 90, h: 30 },
            { kind: 'listbox', name: 'lstNotas', items: ['4', '2'], x: 20, y: 66, w: 140, h: 150 },
            { kind: 'label', name: 'lblPromedio', text: 'Promedio: 3.00', x: 190, y: 80, w: 220, h: 24 },
            { kind: 'label', name: 'lblAprobados', text: 'Aprobados: 1', x: 190, y: 116, w: 220, h: 24 },
          ]),
          { type: 'code', lang: 'csharp', text: code('public partial class Form1 : Form', '{', '    private double suma = 0;', '    private int cantidad = 0;', '    private int aprobados = 0;', '', '    private void btnAgregar_Click(object sender, EventArgs e)', '    {', '        double nota;', '        if (!double.TryParse(txtNota.Text, out nota) || nota < 0 || nota > 5)', '        {', '            MessageBox.Show("Escribe una nota entre 0 y 5.");', '            return;', '        }', '', '        suma += nota;', '        cantidad++;', '        if (nota >= 3) aprobados++;', '', '        lstNotas.Items.Add(nota);', '        lblPromedio.Text = "Promedio: " + (suma / cantidad).ToString("0.00");', '        lblAprobados.Text = "Aprobados: " + aprobados;', '        txtNota.Clear();', '        txtNota.Focus();', '    }', '}') },
          { type: 'table', columns: ['Clic', 'Nota', 'suma', 'cantidad', 'aprobados', 'Promedio'], rows: [['1.º', '4', '4', '1', '1', '4.00'], ['2.º', '2', '6', '2', '1', '3.00'], ['3.º', '5', '11', '3', '2', '3.67']] },
          { type: 'tip', text: 'Una variable dentro del método nace y muere en cada clic. Si declaras int cantidad = 0; dentro de btnAgregar_Click, cantidad vuelve a 0 en cada clic y nunca pasa de 1. Los acumuladores van fuera, al inicio de la clase.' },
        ],
        exercises: [
          { id: 'wf-6-1', type: 'choice', prompt: '¿Por qué suma y cantidad se declaran fuera del método?', options: ['Para que recuerden su valor entre un clic y el siguiente', 'Porque C# no permite variables dentro de métodos', 'Para que el ciclo termine'], answer: 'Para que recuerden su valor entre un clic y el siguiente' },
          { id: 'wf-6-2', type: 'choice', prompt: 'Si declaras int cantidad = 0; dentro de btnAgregar_Click, ¿qué pasa?', options: ['Vuelve a 0 en cada clic y nunca pasa de 1', 'Funciona igual', 'No compila'], answer: 'Vuelve a 0 en cada clic y nunca pasa de 1' },
          { id: 'wf-6-3', type: 'typed', prompt: 'Se agregan las notas 4 y 2. ¿Cuál es el promedio?', answer: '3', alternatives: ['3.00', '3,00'] },
          { id: 'wf-6-4', type: 'choice', prompt: 'Se agregan las notas 4, 2 y 5. ¿Cuántos aprobados muestra lblAprobados?', options: ['2', '3', '1'], answer: '2', explanation: 'Aprueban 4 y 5 (>= 3); el 2 no.' },
          { id: 'wf-6-5', type: 'choice', prompt: '¿Qué hace return dentro del if de validación?', options: ['Sale del manejador sin agregar la nota', 'Cierra la ventana', 'Repite la lectura'], answer: 'Sale del manejador sin agregar la nota', explanation: 'Si la nota es inválida, se avisa y no se sigue sumando.' },
          { id: 'wf-6-6', type: 'choice', prompt: 'El usuario escribe «abc» en txtNota. ¿Qué pasa con TryParse?', options: ['Devuelve falso: se muestra el mensaje y no se agrega nada', 'El programa se cierra con un error', 'Se agrega 0'], answer: 'Devuelve falso: se muestra el mensaje y no se agrega nada' },
          { id: 'wf-6-7', type: 'reorder', prompt: 'Ordena lo que hace el clic cuando la nota es válida.', tokens: ['suma += nota;', 'cantidad++;', 'if (nota >= 3) aprobados++;', 'lblPromedio.Text = "Promedio: " + (suma / cantidad).ToString("0.00");'], answer: ['suma += nota;', 'cantidad++;', 'if (nota >= 3) aprobados++;', 'lblPromedio.Text = "Promedio: " + (suma / cantidad).ToString("0.00");'], explanation: 'Primero se acumula y se cuenta; el promedio se calcula con los valores ya actualizados.' },
        ],
      }],
    },
  ],
}
