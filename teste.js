let numVariaveis = Number()
let selectVariaveis

let objetivoFuncao = Number()
let selectObjetivo

let numRestricao = 0

let simplex = []
let tabela


function setParametros() {
  selectObjetivo = document.getElementById('select-objetivo')
  objetivoFuncao = Number(selectObjetivo.value)
  selectObjetivo.setAttribute('disabled', null)

  selectVariaveis = document.getElementById('select-variaveis')
  numVariaveis = Number(selectVariaveis.value)
  selectVariaveis.setAttribute('disabled', null)

  desabilitarBtnGerarProblema()

  criarFuncaoObjetiva()

  renderizaBtnRestricoes()
}

function criarFuncaoObjetiva() {
  tabela = document.createElement('table')
  let tamanho = numVariaveis + 3
  let cabecalho = tabela.createTHead().insertRow(0)

  for (let i = 0; i < tamanho; i++) {
    if (i == 0) {
      cabecalho.insertCell(i).innerHTML = 'Z'
    } else if (i > 0 && i < tamanho - 2) {
      cabecalho.insertCell(i).innerHTML = `X${i}`
    } else if (i == tamanho - 2) {
      cabecalho.insertCell(i).innerHTML = ''
    } else if (i == tamanho - 1) {
      cabecalho.insertCell(i).innerHTML = 'Resultado'
    }
  }

  let linhaObjetiva = tabela.createTBody().insertRow(0)

  for (let i = 0; i < tamanho; i++) {
    if (i == 0) {
      linhaObjetiva.insertCell(i).innerHTML = '<input type="number" value="1" readonly>'
    } else if (i > 0 && i < tamanho - 2) {
      linhaObjetiva.insertCell(i).innerHTML = '<input type="number" required>'
    } else if (i == tamanho - 2) {
      linhaObjetiva.insertCell(i).innerHTML = `<select id="select-inequacao">
      <option value="=" selected>=</option>
    </select>`
    } else if (i == tamanho - 1) {
      linhaObjetiva.insertCell(i).innerHTML = '<input type="number" value="0" readonly>'
    }
  }

  let gerarTabela = document.getElementById('tabela')

  gerarTabela.appendChild(tabela)
}

function addRestricao() {
  numRestricao++

  let tamanho = numVariaveis + 3

  let corpoTabela = document.querySelector('tbody')
  let tamanhoCorpoTabela = corpoTabela.childElementCount
  let restricao = corpoTabela.insertRow(tamanhoCorpoTabela)

  for (let i = 0; i < tamanho; i++) {
    if (i == 0) {
      restricao.insertCell(i).innerHTML = '<input type="number" value="0" readonly>'
    } else if (i > 0 && i < tamanho - 2) {
      restricao.insertCell(i).innerHTML = '<input type="number" required>'
    } else if (i == tamanho - 2) {
      restricao.insertCell(i).innerHTML = `<select id="select-inequacao" required>
      <option selected value="&lt;=">&lt;=</option>
      <option value="=">=</option>
      <option value="&gt;=">&gt;=</option>
    </select>`
    } else if (i == tamanho - 1) {
      restricao.insertCell(i).innerHTML = '<input type="number" required>'
    }
  }
}

function rmRestricao() {
  let corpoTabela = document.querySelector('tbody')

  if (corpoTabela.childElementCount > 1) {
    corpoTabela.removeChild(corpoTabela.lastElementChild)
  }

  numRestricao--
}

function receberTabela() {
  let corpoTabela = document.querySelector('tbody')
  let linhas = corpoTabela.getElementsByTagName('tr')
  let contLinhas = 0

  for (let i = 0; i < linhas.length; i++) {
    let linha = []
    let celulas = linhas[i].getElementsByTagName('td')
    for (let j = 0; j < celulas.length; j++) {
      let input = celulas[j].getElementsByTagName('input')[0]
      if (input && input.type === 'number') {
        linha.push(Number(input.value))
      }
      else {
        let select = celulas[j].getElementsByTagName('select')[0]
        linha.push(select.value)
      }
    }
    linha = criaFolga(linha, contLinhas)
    simplex.push(linha)
    contLinhas++
  }

  criarFormaPadrao()
  console.log(simplex);

  desabilitaBtnResolver()
}

function criaFolga(linha, contLinhas) {
  let inequacao = numVariaveis + 1
  let valorFolga = 0
  let contFolga = inequacao

  for (let i = 0; i < numRestricao; i++) {
    if (contLinhas != 0) {
      if (linha[contFolga] == '<=' && i == contLinhas - 1) {
        valorFolga = 1
      } else if (linha[contFolga] == '>=' && i == contLinhas - 1) {
        valorFolga = -1
      } else {
        valorFolga = 0
      }
    }

    linha.splice(contFolga, 0, valorFolga)
    contFolga++
  }

  return linha
}

function criarFormaPadrao() {
  let tamanho = numVariaveis + numRestricao + 3
  let z = 0
  let inequacao = numVariaveis + numRestricao + 1
  let resultado = inequacao + 1

  console.log(simplex.length);

  for (let i = 0; i < simplex.length; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (i == z && j != z && j != inequacao) {
        simplex[i][j] *= -1
        console.log(`O elemento ${simplex[i][j]} da linha Z alterou`)
      }

      if (j == resultado && simplex[i][j] < 0) {
        simplex[i][j] *= -1
        console.log(`O resultado da linha ${i + 1} alterou`);
      }

      if (j == inequacao) {
        simplex[i][j] = '='
        console.log(`A inequação da linha ${i + 1} virou igualdade`);
      }
    }
  }
}

function mostrarTabela() {

}

// FUNÇÕES PARA BOTÕES

function desabilitarBtnGerarProblema() {
  let btnGerarProblema = document.getElementById('btn-gerar-problema')
  btnGerarProblema.setAttribute('disabled', null)
  btnGerarProblema.style.backgroundColor = '#ffffff1a'
  btnGerarProblema.style.opacity = 0.75
}

function renderizaBtnRestricoes() {
  let btnRestricoes = document.getElementById('botoes-restricao')
  let btnResolver = document.getElementById('botao-resolver')

  btnRestricoes.style.display = 'flex'
  btnResolver.style.display = 'flex'
}

function desabilitaBtnRestricoes() {
  let btnAddRestricao = document.getElementById('btn-add-restricao')
  let btnRmRestricao = document.getElementById('btn-rm-restricao')

  btnAddRestricao.setAttribute('disabled', null)
  btnAddRestricao.style.backgroundColor = '#0fb600'
  btnAddRestricao.style.opacity = 0.75

  btnRmRestricao.setAttribute('disabled', null)
  btnRmRestricao.style.backgroundColor = '#b10000'
  btnRmRestricao.style.opacity = 0.75
}

function desabilitaBtnResolver() {
  let btnResolver = document.getElementById('btn-resolver-problema')
  btnResolver.setAttribute('disabled', null)
  btnResolver.style.backgroundColor = '#ffffff1a'
  btnResolver.style.opacity = 0.75

  desabilitaBtnRestricoes()
}

