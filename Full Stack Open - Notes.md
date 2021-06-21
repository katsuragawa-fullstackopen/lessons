# Full Stack Open - 2021





## Primeira Parte



### Introdução ao React



#### Inicializar

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

#### Props

Podemos ter vários componentes dentro do React e utilizar props para passar informações entre eles.

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

#### useState

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

A variável `counter` é inicializado com o state de valor zero e a variável `setCounter` é designado a uma função que é utilizada para modificar esse state. Quando o *state* sofre mudança, o React re-renderiza o componente.

#### Event handler

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

#### Keys

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

Vamos adicionar uma funcionalidade que vai mostrar somente as notas com o parâmetro `important: true`.  Primeiro vamos adicionar um *state* que vai ser responsável por determinar quais notas vão ser mostradas.

```react
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Agora se o *state* de `showAll` for `true`, a variável `notesToShow` recebe todas as notas armazenadas no *state* notes. Caso for `false`, é passado para a variável somente as notas com `important: true`.

Vamos então adicionar um botão responsável por alterar o *state* do `showAll` entre verdadeiro e falso.

```react
import React, { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...    
    </div>
  )
}
```

Quando clicado, o botão inverte o *state* do `showAll`. O conteúdo dentro do botão também é alterado: ele fica **show important** caso `showAll` seja `true` e **show all** caso seja `false`.



### Utilizando um servidor

#### json-server

Na próxima parte iremos trabalhar no *backend*, porém já podemos ir nos familiarizando com a ideia utilizando o *JSON Server*. Criaremos um arquivo chamado ***db.json*** no *root* do diretório contento as notas no formato JSON.

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2019-05-30T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2019-05-30T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2019-05-30T19:20:14.298Z",
      "important": true
    }
  ]
}
```

Para instalar o *JSON Server* globalmente na máquina é só usar o comando `npm install -g json-server`. Porém não é necessário uma instalação global.

No *root* da nossa pasta use o comando `npx json-server --port 3001 --watch db.json`.

Por padrão, o *json-server* roda no port 3000, porém como nossa aplicação React está nesse mesmo port, precisa especificar uma outra (3001) para evitar conflito.

Pronto, agora temos um servidor que nos fornece os dados `notes` quando fizermos um *http get request* rodando no endereço http://localhost:3001/notes.  Para acessar uma nota específica é só adicionar o id dela no *request*: http://localhost:3001/notes/:id.



### npm

Para utilizar *fetch* e pedir dados para o servidor utilizaremos o *library* chamado ***axios***. Hoje em dia, praticamente qualquer aplicação em JavaScript são definidos utilizando o *node package manager*, ou ***npm***. O nosso projeto criado pelo *create-react-app* também, sendo o arquivo *package.json* tal indicador.

Vamos então instalar o *axios* pelo comando `npm install axios` e ele vai aparecer dentro do *package.json* como uma dependência. Instale também o *json-server*, mas dessa vez como um *development dependency* com o comando `npm install json-server --save-dev`

Obg. Sempre rode os comandos *npm* no *root*.

Adicione um *script* para não ter que usar o comando `npx json-server --port 3001 --watch db.json` toda vez que quiser rodar o servidor.

```json
{
  // ... 
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json"
  },
}
```

Agora conseguimos rodar só com o comando `npm run server`.

Utilize dois terminais para rodar o React app e o servidor.



### Axios e promessas

Importe *axios* e mude o *index.js* 

```react
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)
```

Obs. Quando *index.js* é alterado, o React não recarrega a página sozinho. Para mudar esse comportamento crie um *.env* no *root* e adicione `FAST_REFRESH=false` e reinicie a aplicação.

O *axios* retorna uma **promessa**, que é:

> um objeto representando a conclusão ou falha de uma operação *async*.

Ela pode ter 3 estados diferentes:

1. *Pending*: na qual ela ainda não concluiu nem falhou ainda;
2. *Fulfilled*: quando foi completada e o valor final está disponível;
3. *Rejected*: quando ocorre um erro e o valor final não pode ser determinado.

#### .then()

Podemos definir um *event handler* para quando o *axios* retorna uma promessa com sucesso, utilizando o método `then`.

```react
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```

O ***JavaScript runtime environment*** chama a função de callback registrado pelo `then`, providenciando como argumento o objeto `response`. Nele contém todas os dados essenciais a resposta de um *HTTP GET request*, como *data, status code e headers*.

Vamos então retirar a variável `notes` que estava *hardcoded* no nosso *index.js* e substituir por um *request*.

```react
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import axios from 'axios'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})
```

Chamar um *HTTP request* assim pode ser aceitável em algumas circunstâncias, mas o correto é realizar o *fetch* dentro do componente *App*. Isso que faremos à seguir.



### Effect-hooks

> *The Effect Hook lets you perform side effects in function components.* *Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

Vamos voltar para a versão simples do *index.js* e realizar o *fetch* dentro do componente *App*. 

```react
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // ...
}
```

Vai aparecer no console:

```bash
render 0 notes
effect
promise fulfilled
render 3 notes
```

Quando o componente é renderizado pela primeira fez, não ocorreu o *fetch* dos dados ainda. A função dentro do `useEffect` é executado imediatamente depois e realiza o *request*. A resposta do servidor então é repassado para o *state* notes pelo `setNotes`. Essa modificação faz o componente ser re-renderizado.

#### Segundo parâmetro

O `useEffect` recebe mais um parâmetro além da função, nesse caso `[]`. Por padrão, `useEffect` é chamado toda fez que o componente é renderizado, o segundo parâmetro controla esse comportamento. `[]` faz com que seja chamado somente na primeira vez que é carregado.



### Alterando dados no servidor

#### POST 

Para enviar dados ao servidor vamos adicionar o seguinte bloco de código.

```react
addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date(),
    important: Math.random() < 0.5,
  }

  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
}
```

Note que removemos o *id*, assim o servidor fica responsável por gerar essa informação. O objeto é enviado utilizando o método *post*, e quando o servidor recebe o *request*, podemos acessar o `response` e em seu `data` está o objeto adicionado. Por vez, chamamos o `setNotes` para modificar o *state* conforme essa adição e o componente é renderizado de novo.

#### PUT

Agora vamos adicionar um botão que altera a importância das notas. No componente *Notes*:

```react
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

e no *App*:

```react
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
	const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
  }

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```

A primeira linha dentro o `toggleImportanceOf` define um url único para cada nota baseado em seu id. O método *Array.find* encontra a nota que queremos modificar e com base nisso criamos uma nova variável `changedNote` com a importância alterada, assim não altera o *state* da nota original diretamente. Por fim a nota é enviada para o servidor com um *PUT request* e modificamos utilizando o `setNotes` através da resposta recebida do servidor. O `map` filtra de modo que somente a nota que nos interessa seja alterada.



### Modularizando o projeto

A adição da comunicação com o servidor deixou o componente *App* um pouco abarrotado, vamos separar isso em um módulo em *src/services/notes.js*.

```react
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }
```

Assim, só precisamos importar o novo módulo em *App.js* e modificar a parte que realiza os *requests*.

```react
import noteService from './services/notes'

const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // ...
}
```



### Promessas e erros

O método `then` é executado quando a promessa é completada, podemos adicionar o método `catch` para quando ocorre algum erro.

```react
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```



### Adicionando estilos 

Não vou entrar em muito detalhe, mas tem como passar direto pelo React *inline styles*.

```react
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
    <br />
    <em>
      Note app, Department of Computer Science, University of Helsinki 2021
    </em>
    </div>
  )
}
```





## Terceira Parte

### Node.js e Express

#### Iniciar a partir de um template

```bash
$ npm init
```

Vamos fazer uma mudança no *package.json* criando um script para iniciar o backend.

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    // ...
  },
  // ...
}
```

Agora podemos inicializar com `npm start`

#### Express

Express é uma biblioteca pra facilitar a construção do backend.

```bash
npm install express
```

No arquivo *index.js*:

```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

*Node.js* utiliza os módulos chamados de ***CommonJS***, não suportando a importação *ES6*, ainda.

No início importamos *express* e criamos uma aplicação express, *app*. A seguir, criamos duas rotas para a aplicação. O primeiro define um *event handler* para toda vez que um *GET* *request* é feito para *"/"* *root*. 

#### Request e response

O *event handler* aceita dois parâmetros, *request* que contém todas as informações do *HTTP request* e o segundo *response* é usado para definir o que o servidor deve devolver para o browser.

Então quando a aplicação recebe um *GET request* para *"/"*, ele devolve enviando uma resposta contendo a *string*  `'<h1>Hello World!</h1>'`.

A segunda rota também define um *event handler*, para o caminho *"/api/notes"* e retorna notes como uma *string* formatada como *JSON*.

#### nodemon

Essa biblioteca reinicia a aplicação automaticamente toda vez que detecta uma alteração nos arquivos, durante o desenvolvimento é algo muito prático.

```bash
$ npm install --save-dev nodemon
```

`--save-dev` faz com que a dependência do package seja somente para o desenvolvimento e não para produção.

Para iniciar a aplicação utilizando o nodemon `node_modules/.bin/nodemon index.js` ou adicionamos um script para facilitar.

```json
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

E agora rodamos com `npm run dev`.

#### REST

| URL      | Verbo  | Funcionalidade                                |
| -------- | ------ | --------------------------------------------- |
| /notes   | GET    | busca todos os recursos                       |
| /notes/3 | GET    | busca um recurso único                        |
| /notes   | POST   | cria um novo recurso*                         |
| /notes/3 | PUT    | substitui por inteiro o recurso identificado* |
| /notes/3 | PATCH  | substitui uma parte do recurso identificado*  |
| /notes/3 | DELETE | remove o recurso identificado                 |

**Baseado no request data*

#### Buscando um recurso único

Vamos adicionar uma rota que retorna ao browser uma única nota.

```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
	
  if (note) {
	  response.json(note)    
  } else {
    response.status(404).end()
  }
})
```

O nosso servidor identifica na URL o id da nota e filtra as notas, retornando uma *string* formatado como *JSON* na resposta. Caso não ache nenhuma nota com o id passado, retornamos o *status* 404. O `end()` serve para finalizar a resposta sem ter nenhum conteúdo.

#### Deletando um recurso

```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```

#### Adicionando um recurso

Para adicionar, precisamos de um *[middleware](https://expressjs.com/en/api.ht	ml)* nativo do *express* chamado *json-parser*. Sem ele o *request body* seria *undefined*.

```js
const express = require('express')
const app = express()

app.use(express.json())
//...

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }
  
  notes = notes.concat(note)
  
  response.json(note)
})
```

O *event handler* salva em uma variável o corpo do *request* e através do método `concat` adiciona na *array* `notes`. O servidor também é responsável pela criação da id única. Se o conteúdo do *POST request* for vazio retornamos o *status* 400.

#### Middleware

São funções para lidar com os objetos *request* e *response*. Dá pra ter vários ao mesmo tempo, porém eles são executados um por um na ordem que foram tomados em uso. Vmos criar um *middleware* que imprime informações sobre todos os *requests* feitos ao servidor. O *middleware* recebe três parâmetros.

```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
// ...
app.use(requestLogger)
```

O `next()` ao final passa o controle para o próximo *middleware* atender o *request*. 

Note que o *json-parser* precisa ser usado **antes** do nosso *middleware*, se não o *body* seria *undefined*.

As funções *middleware* que precisam ser executadas antes das rotas precisam ser usadas antes. Vamos criar uma outra *middleware* pra caso nenhuma rota seja chamada, nesse caso ela precisa ser usada **depois** das rotas.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

Assim caso o URL esteja incorreto, retornamos o *status* 404 e uma mensagem no formato *JSON* explicando o erro.



### Fazer deploy do aplicativo na internet

#### *Same origin policy* e CORS

> **Cross-Origin Resource Sharing** ou **CORS** é um mecanismo que permite que recursos restritos em uma página da web sejam recuperados por outro domínio fora do domínio ao qual pertence o recurso que será recuperado.[[1\]](https://pt.wikipedia.org/wiki/Cross-origin_resource_sharing#cite_note-mozhacks_cors-1) Uma página da web pode integrar livremente recursos de diferentes origens, como imagens, folhas de estilo, scripts, iframes e vídeos.[[2\]](https://pt.wikipedia.org/wiki/Cross-origin_resource_sharing#cite_note-2) Certas "solicitações de domínio cruzado", em particular as solicitações Ajax, são proibidas por padrão pela [política de segurança de mesma origem](https://pt.wikipedia.org/wiki/Política_de_mesma_origem).

Como nosso *frontend* está hospedado na porta 3000 e o *backend* no 3001, não é permitido realizar *request* entre eles. 

Precisamos permitir o *request* de diferente origens utilizando o *middleware cors* do *Node.js*. Para instalar é `npm install cors`

```js
const cors = require('cors')
app.use(cors())
```

#### Para a internet | backend

Vamos usar o ***[Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)*** para isso. Primeiro adicione um arquivo chamado Procfile (sem formato) no *root* do projeto que dirá ao Heroku como iniciar a aplicação.

```bash
web: npm start
```

E mudar o *PORT* no nosso *index.js*

```js
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Agora só criar um *git repo* e dar *push* para o Heroku.

#### Criar *build* de produção | frontend

Quando faz um deploy, deve ser criar uma *[production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)* e utilizar ela.

```bash
$ npm run build
```

Isso cria uma versão otimizada do *frontend*. Podemos agora copiar essa pasta *build* para o *root* do nosso backend e servir ao browser, utilizando um *middleware* que vem com *express*.

```react
app.use(express.static('build'))
```

Agora toda vez que nosso servidor recebe um *GET request*, confere se o diretório *build* contém o arquivo correspondente ao endereço do pedido, se sim, ele retorna o arquivo. Ou seja, um *GET* ao endereço *www.blablabla.com/index.html* ou simplesmente *www.blablabla.com*, o *express* retorna nosso aplicativo React. Já os pedidos para */api/notes* é gerido pelo backend.

Já que agora ambos utilizam o mesmo endereço, podemos mudar o `baseUrl` dos nossos serviços para ser relativo.

```react
import axios from 'axios'
const baseUrl = '/api/notes'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

Obs. Precisa criar uma nova *build* toda vez que altera algo no aplicativo React pra surgir efeito.

#### Scripts para automatizar o deploy do frontend ao Heroku

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build --prod && cp -r build ../notes-backend",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
```

Obs. No windows para o *powershell* rodar bash `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`.

#### Proxy

Agora que o `baseUrl` está relativo, nosso aplicativo React não funciona mais em modo de desenvolvimento, porque os métodos vão realizar *request* ao URL *localhost:3000* em vez de *3001* como estava explícito. Só adicionar um *proxy* que vai mudar o URL.

```json
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"
}
```



### Utilizando banco de dados: MongoDB

#### MongoDB Atlas

Utilizaremos o [MongoDB](https://www.mongodb.com/) para salvar nossos dados indefinitivamente, [Atlas](https://www.mongodb.com/cloud/atlas) é um provedor de MongoDB com funcionalidade gratuítas. 

Após configurar um *cluster*, obteremos um URI que parece assim

```bash
mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true
```

#### Mongoose

Para facilitar a comunicação com o *database* vamos usar o ***mongoose***.

```bash
$ npm install mongoose
```

Vamos criar um novo arquivo *mongo.js* para testar as funcionalidades.

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

Assim, pelo terminal podemos rodar ele com o comando `node mongo.js <password>`.

O nosso programa primeiro conecta com o servidor e passa alguns parâmetros. A seguir, cria um *schema*, que seria o formato dos objetos armazenados no banco de dados. Atribuímos então esse *schema* a um modelo chamado `Note` que servirá como um construtor. 

Construímos um objeto `note` e por fim salvamos no banco de dados, assim que salvar podemos fechar a conexão.

#### Buscando no banco de dados

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

O bloco acima busca todas as notas salvas no banco de dados, devido ao *query* vazio que foi passado `{}`, e imprime no console cada uma das notas através do método `forEach()`.

Podemos buscar somente as notas importantes:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

### Lidando com erros

Se visitarmos um URL com um id que não existe no banco de dados, receberíamos uma resposta *null*, vamos alterar esse comportamento adicionando uma verificação `if` e também o método  `catch()` para quando a promessa for rejeitada, ou seja, um id mal formatado pelo usuário.

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
			response.status(400).send({ error: 'malformatted id' })
    })
})
```

#### Middleware para erros

Em vez de ter a lógica para lidar com erros em cada *middleware* responsável pelas *requests*, vamos fazer com que toda vez que tem um erro, passamos para o próximo *middleware* com o método `next()`. E então, no final do aplicativo adicionamos um *middleware* com a lógica para tratar os erros.

```js
app.get('/api/notes/:id', (request, response, next) => {  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))})

// ...

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

Caso seja outro tipo de erro, o *middleware* passa pra frente com o `next()`, de modo que o *express* lida com o *error handler* padrão. Os *middlewares* então são usados assim:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

### Outras operações com o banco de dados

#### Deletando um objeto

Dá pra deletar facilmente com o método `findByIdAndRemove()`.

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

#### Atualizando um objeto

Para alterar a importância das notas, podemos utilizar o método `findByIdAndUpdate()`.

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

Qualquer erro que ocorra é passado para o próximo *middleware* responsável.

Note que para atualizar, não criamos o objeto utilizando o construtor *Note* e sim um simples objeto JavaScript.

Há um outro detalhe importante em relação ao uso do [método `findByIdAndUpdate()`](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). Por padrão, o parâmetro o *data base* retorna como resposta o objeto **antes** da modificação. Adicionamos o parâmetro opcional `{ new: true }`, que fará com que nosso manipulador de eventos seja chamado com o **novo** documento modificado, ao invés do original.



### Validação

Em vez de validar o *body* do request dentro do *middleware*

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  // ...
})
```

Vamos mudar para ser validado antes de ser enviado ao servidor, utilizando *mongoose*. O melhor jeito é adicionar regras de validações no *schema*.

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  important: Boolean
})
```

`minLength` e `required` são validadores nativos do *mongoose*, podemos criar também [validadores customizados](https://mongoosejs.com/docs/validation.html#custom-validators). Se tentarmos guardar no banco de dados um objeto que não atende os validadores, a operação abrirá uma exceção.

```js
app.post('/api/notes', (request, response, next) => {  
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))})
```

Vamos adicionar esse erro ao nosso `errorHandler`

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
```

#### Deploy do backend com o banco de dados

Vamos usar o *dotenv* para salvar as informações sensíveis do banco de dados numa *enviroment variable*.

```bash
$ npm install dotenv
```

Criamos um arquivo *.env*.

```bash
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```

E o nosso *index.js* do backend fica.

```js
require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
// ..

const PORT = process.env.PORTapp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Para passar as variáveis ao Heroku usamos o comando

```bash
heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

Dai é só gerar uma nova *build* e realizar o push.



### ESLint

```bash
$ npm install eslint --save-dev
```

Essa biblioteca e extensão do VSCode nos ajuda a ter um código mais limpo e evita bugs. Inicializamos com `node_modules/.bin/eslint --init.`

Após responder as perguntas, temos um arquivo de configuração `.eslintrc.js` que podemos ajeitar.

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
    }
}
```

É recomendado adicionar um *script* no nosso *package.json* 

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```

Agora `npm run lint` vai verificar todos os arquivos do diretório. Mas queremos que ele ignore o *build*, então vamos criar um arquivo chamado [*.eslintignore*](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) contendo `build`.

Podemos adicionar *rules* customizadas ao ESLint também.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
```





## Quarta Parte

### Estruturação do Backend

Nessa parte vamos melhorar a estrutura do nosso projeto, iniciando pelos `console.log()`, separando em um módulo em */utils/logger.js*.

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

A importação das *enviroment variables* também podemos separar no módulo */utils/config.js*.

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

Separamos os *route handlers*, criando um arquivo *controllers/note.js*.

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

É quase um *copy-paste* do que tinha no *index.js*, porém tem algumas modificações significantes. A primeira é a utilização de um [*router object*](http://expressjs.com/en/api.html#router) na primeira linha e outro é o *url*, em vez de `/api/notes/:id` por exemplo, só precisamos do *url* relativo `/:id`.

Vamos também ter um módulo para os *middleware* que criamos em *utils/middleware.js*.

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

Por fim vamos passar a responsabilidade de se conectar com o *MongoDB* para o *app.js* juntamente com a maior parte do que estava no *index.js*, importando todos os módulos. Esse seria o aplicativo *express*.

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

E remover a responsabilidade de se conectar com o banco de dados do *models/note.js*.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

Depois de tudo, agora o *index.js* fica simplesmente:

```js
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```





### Testando o backend

Já que nossa aplicação tem uma lógica simples, não faz ainda sentido criar [**testes unitários**](https://en.wikipedia.org/wiki/Unit_testing). Em alguns casos, pode ser beneficial implementar testes utilizando banco de dados simulados, uma biblioteca para isso seria [*mongo-mock*](https://github.com/williamkapke/mongo-mock).

A nossa aplicação será testada através de seus *REST API*, de modo que inclua o banco de dados. Esse tipo de teste que engloba múltiplos componentes que são analisados como um grupo são chamados [***integration testing***](https://en.wikipedia.org/wiki/Integration_testing).

#### Ambiente de teste

É um costume em *Node* definir o modo de execução da aplicação (produção ou desenvolvimento) com a variável ambiental `NODE_ENV`.

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

Adicionamos também a opção `--runInBand` no *script npm*  que executa os testes, que impede o *Jest* a rodar testes em paralelo.

Obs. Para os scrips funcionar no Windows, precisa instalar *cross-env*.

```bash
$ npm install --save-dev cross-env
```

Agora podemos modificar a aplicação para ter diferentes comportamentos dependendo do modo que foi iniciado. Vamos mudar a configuração da aplicação para usar um *URI* diferente caso esteja rodando um teste.

```js
require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

```bash
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

TEST_MONGODB_URI=mongodb+srv://fullstack:secret@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
```

Esses são as únicas modificações no código por enquanto.

#### Jest.js

[*Jest*](https://jestjs.io/docs/api) é um framework de testes para *JavaScript* que funciona para projetos em React e Node.

```bash
$ npm install --save-dev jest
```

#### supertest

Vamos usar esse *package* para ajudar a escrever os testes que interagem com o API.

```bash
$ npm install --save-dev supertest
```

E já vamos criar o primeiro teste em *tests/note_api.test.js*

```js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

// wraps the express app with the supertest function
const api = supertest(app);

// create hardcoded notes for test
const Note = require("../models/note");
const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

// actions to take before the test
beforeEach(async () => {
  // clear database
  await Note.deleteMany({});
  // create and save notes
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

// test if notes are returned as json
test("Notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// test length
test("All notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

// test first note content
test("A specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContain("Browser can execute only Javascript");
});

// action after testes are completed
afterAll(() => {
  mongoose.connection.close();
});
```

No começo importamos o nosso *express app* e depois o *supertest* utiliza um *superagent* para englobar a aplicação e realizar os *requests*.

Quando executamos os testes o *console* fica bem congestionado, então vamos limpar o */utils/logger.js*.

```js
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
```

#### Rodando um teste de cada vez

O *Jest* possui o método `test.only()` para executar somente esse teste, mas podemos utilizar o *bash* para especificar qual teste será executado.

Para executar os testes em um arquivo:

```bash
$ npm test -- tests/note_api.test.js
```

Para um teste específico:

```bash
$ npm test -- -t "a specific note is within the returned notes"
```

Ou utilizando *keyword*:

```bash
$ npm test -- -t 'notes'
```

#### Async / Await

Nova sintaxe introduzido no ES7 para remover *callback functions*. Isso:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

Se torna:

```js
const main = async () => {
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}
main()
```

Lembrando que `await` precisa ser usado dentro de uma função`async`.

Vamos mudar nosso backend para utilizar essa sintaxe, a rota para buscar todas as notas fica.

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Porém agora ficamos sem *error handler* que era feito pelo `catch()`, o jeito mais simples é com o `try/catch`;

```js
notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})
```

Para facilitar, temos a *library* chamada *express-async-errors* que basicamente faz isso de forma automatizada.

```bash
$ npm install express-async-errors
```

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
// ...

// ...

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = app
```

Por causa da biblioteca, não precisamos mais chamar `next()`, ela cuida de tudo.

#### Reestruturação dos testes e modulação

Como muitos testes precisam verificar quais são as notas no banco de dados no momento, vamos modular algumas funções que podem ser úteis em mais de um teste. Também vamos adicionar o `describe` que divide os testes de acordo com as funções do código. Primeiro o módulo *helper_test.js*.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

E agora, com adições de mais testes, o nosso arquivo fica:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

// ações antes de cada teste
beforeEach(async () => {
  // deleta tudo no banco de dados
  await Note.deleteMany({})
  // adiciona as notas em initialNotes
  await Note.insertMany(helper.initialNotes)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invaild', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
```



### Admin

