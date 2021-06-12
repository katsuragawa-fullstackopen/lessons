# Full Stack Open - 2021





## Primeira Parte



### Introdução ao React

Para iniciar um React app:

```bash
npx create-react-app <nome do app>
cd <nome do app>
npm start
```

Por padrão ele roda no localhost com PORT = 3000

Podemos simplificar o código dentro do *index.js* 

```react
import ReactDOM from 'react-dom'
import App from './App'
ReactDOM.render(<App />, document.getElementById('root'))
```

e o *App.js*

```react
import React from 'react'
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
export default App
```

Parece que ele retorna HTML mas na verdade é JSX.

Podemos ter vários componentes dentro do React e se usa props para passar informações entre eles.

```react
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```



### Component state, event handlers

Para ter componentes com estados que podem mudar durante o lifecycle dele, podemos usar o state hook do React.

```react
import React, { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

export default App
```

A variável `counter` é inicializado com o state de valor zero e a variável `setCounter` é designado a uma função que é utilizada para modificar esse state. Quando o state sofre mudança, o React re-renderiza o componente.

Agora vamos adicionar um botão ao nosso componente que vai incrementando o `counter`.

```react
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    setCounter(counter + 1)
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

O atributo `onClick` do botão vira uma referência para a função `handleClick`, chamada de *event handler* que é uma *function call* .

Ele pode também ser definido direto no atributo `onClick`.

```react
<button onClick={() => setCounter(counter + 1)}>
```

**ISSO NÃO FUNCIONA:** 

```react
<button onClick={setCounter(counter + 1)}>
```

Pois ao renderizar o componente, React executa a *function call* `setCounter(0 +  1)` que por sua fez re-renderiza o componente, entrando em um loop infinito.



### States mais complexos

As vezes precisamos de diversos states que são correlatos, como exemplo

```react
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

Mas podemos salvar `right` e `left` em um único objeto `{ left: 0, right: 0 }`. E aproveitando, vamos adicionar um state que vai lembrar todos os clicks que ocorreram.

```react
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const newClicks = { 
      ...clicks,  
      left: clicks.left + 1, 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const newClicks = { 
      ...clicks
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
```

Mesmo que seja tentador fazer utilizar o método `Array.push` é **proibido no React** modificar diretamente o state, pois pode causar bugs e comportamentos indesejáveis difíceis de debugar depois.

Vamos adicionar agora uma condicional para renderizar.

```react
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

Agora dependendo do tamanho da *array* contendo o histórico, o componente vai renderizar diferente.



### Debugging React apps

**A primeira regra do Web Development:**

>**Keep the browser's developer console open at all times.**
>
>The *Console* tab in particular should always be open, unless there is a specific reason to view another tab.

Quando surgir um *bug* procure e arrume **imediatamente**, não tente continuar a desenvolver sem ter arrumado.

Tanto quanto o `useState` e o `useEffect`, que veremos depois, **não devem ser chamados** dentro de um loop, condicional ou qualquer outro lugar que não seja a função que define o componente.

```react
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```



### Revisitando event handler

Se por acaso precisar *muito* passar uma variável e por isso ter que chamar uma função diretamente no *event handler*, use uma função que retorna outra função.

```react
const App = () => {
  const [value, setValue] = useState(10)

  const hello = (who) => {
    const handler = () => console.log('hello', who)
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello('world')}>button</button>
    </div>
  )
}
```

Assim, consegue passar `onClick={hello(arg)}` sem ter erros.

Dá pra usar o mesmo truque para definir *event handler* que modifica o state de um componente pra algum valor.

```react
const App = () => {
  const [value, setValue] = useState(10)
  
  const setToValue = (newValue) => () => {
    setValue(newValue)
  }
  
  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
```

Ou podemos simplesmente:

```react
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

E como uma última *observação*:

### Do not define components within components





## Segunda Parte



### Renderizando coleções

Vamos criar nessa parte a lógica *browser-side*, ou frontend, de uma aplicação, iniciando pelo *App.js*

```react
import React from 'react'

const App = (props) => {
  const { notes } = props

  return (
    <div>
      <h1>Notes</h1>
      <ul>
          {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </div>
  )
}

export default App
```

E o *index.js*

```react
import ReactDOM from 'react-dom'
import App from './App.js'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

ReactDOM.render(
  <App notes={notes} />,
  document.getElementById('root')
)
```

Quando o componente *App* é chamado e renderizado pelo *index.js* passamos o *array* de notes como props. Dentro do componente *App*, cada nota é renderizado em uma lista utilizando o método *Array.map*.

É importante também passar uma *key* única para cada *child* gerada pelo método *map*. Para mais leitura pode ir na [página do React](https://reactjs.org/docs/lists-and-keys.html#keys) em que explicam com mais detalhe. Mas basicamente o React precisa disso para identificar quando os itens mudam.

**Obs.** Não usar o ***index*** do item como *key*.



### Formulários

Vamos expandir nossa aplicação para que o usuário possa adicionar notas. Pra isso primeiro adiciona um `useState` que vai monitorar e modicar a lista de notas.

```react
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

Agora vamos adicionar o formulário e uma função responsável para modificar o *state* do `notes`, também um novo *state* para as novas notas.

```react
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState("New note...")
  
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
    
    setNotes(notes.concat(noteObject))
    setNewNote("")
  }  

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={() => setNewNote(newNote)} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

O `addNote` é um *event handler* que é chamado quando o evento *submit* ocorre no browser.  O método para o evento *preventDefault* previne a ação padrão de recarregar a página quando ocorre um *submit*.

O `value` dentro do *input* é passado como a nova nota toda vez que ocorre `onChange` pelo `setNewNote`

Quando o *button* é clicado e o formulário é enviado, a função `addNote` é executado e cria um novo objeto `noteObject` com o *content* igual ao valor que esta no *input*. O `date` é a data atual formatado como *ISO string*, o `important` é o resultado de uma função aleatória que retorna `true` ou `false` e o `id` é o comprimento mais um da *array*. Após criar esse objeto, chamamos a função `setNotes` e devolvemos uma *array* com o objeto no final dela. Por fim, limpamos o *value* do *input* ao modificar o *state* do `newNotes`.

 **NÃO USAR .push(arr)!** Como falamos antes é proibido alterar um *state* diretamente.



### Filtrando elementos



