// const buttons = require("./buttons")

// buttons.desabilitaBtnResolver

// =-=-=-=-= Variáveis Principais =-=-=-=-=
// Número de váriaveis
let numVariaveis = Number()
let selectVariaveis

//Objetivo da Função
let objetivoFuncao = Number()
let selectObjetivo
let objetivo

// Número de Restrições
let numRestricao = 0

// Lista de Arrays (Matriz) que guarda todos os valores da tabela
let simplex = []
// Variável que referencia a tabela inicial que é preenchida
let tabelaInicial
// Variável que referencia as tabelas que serão geradas pelo método simplex
let tabelaSimplex

// =-=-=-=-= Variáveis de Controle =-=-=-=-=
// Limite do index das variáveis
let variaveis = 0
//Limite do index das folgas
let folgas = 0
// Index da inequação ou igualdade
let inequacao = 0
// Index do Resultado 
let resultado = 0
// Tamanho de uma linha da tabela
let tamanho = 0
// Condição de parada do Método Simplex
let condicaoParada = false
// Condição para ser usada apenas em uma centralização
let condicaoCentraliza = false
// Index da coluna pivô
let indexColunaPivo
// Index da linha pivô
let indexLinhaPivo
// Variável que define o limite de iterações para não quebrar a aplicação
let itera = 0
// Variável que conta a quantidade de tabelas a fim de criar um id único
let contTabela = 0
// variavel que serve para armazenar a razão de b/elemento pivo
let menorPositivo
// variavel que serve para armazenar a soma da linha de um elemento pivo
let menorSoma

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
  tabelaInicial = document.createElement('table')
  tamanho = numVariaveis + 3
  let cabecalho = tabelaInicial.createTHead().insertRow(0)

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

  let linhaObjetiva = tabelaInicial.createTBody().insertRow(0)

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

  let gerarTabela = document.getElementById('tabela-inicial')

  gerarTabela.appendChild(tabelaInicial)
}

function addRestricao() {
  numRestricao++

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

  desabilitaBtnResolver()

  gerarTexto('h2', 'Tabela Inicial')

  mostrarTabela()

  colunaPivo()

  while (condicaoParada === false && itera < 10) {
    gerarTexto('h2', `Iteração: ${itera + 1}`)
    mostrarTabela()
    destacaColunaPivo()
    destacaLinhaPivo()

    let variavelEntrada
    if (Number.isInteger(simplex[0][indexColunaPivo]) == false) {
      variavelEntrada = simplex[0][indexColunaPivo].toFixed(3)
    } else {
      variavelEntrada = simplex[0][indexColunaPivo]
    }

    if (objetivo.value == 1) {
      gerarTexto('p', `Coluna pivô identificada na coluna ${indexColunaPivo + 1}, com o maior valor negativo sendo: ${variavelEntrada}`)
    } else {
      gerarTexto('p', `Coluna pivô identificada na coluna ${indexColunaPivo + 1}, com o menor valor absoluto sendo: ${variavelEntrada}`)
    }

    elementosPivo()
    mostrarTabela()
    destacaColunaPivo()
    destacaLinhaPivo()

    let elementoPivo
    let razao


    for (let i = 1; i < simplex.length; i++) {
      if (Number.isInteger(simplex[i][indexColunaPivo]) == false) {
        elementoPivo = simplex[i][indexColunaPivo].toFixed(3)
      } else {
        elementoPivo = simplex[i][indexColunaPivo]
      }

      if (Number.isInteger(menorPositivo) == false) {
        razao = (simplex[i][resultado] / simplex[i][indexColunaPivo]).toFixed(3)
      } else {
        razao = (simplex[i][resultado] / simplex[i][indexColunaPivo])
      }

      if (objetivo.value == 1) {
        gerarTexto('p', `Elemento pivô '${elementoPivo}' da linha ${i + 1}, possui a razão de: ${razao}`)
      } else {
        gerarTexto('p', `Elemento pivô '${elementoPivo}' da linha ${i + 1}, possui a soma total da linha de: ${razao}`)
      }
    }

    linhaPivo()
    mostrarTabela()
    destacaColunaPivo()
    destacaLinhaPivo()

    if (Number.isInteger(simplex[indexLinhaPivo][indexColunaPivo]) == false) {
      elementoPivo = simplex[indexLinhaPivo][indexColunaPivo].toFixed(3)
    } else {
      elementoPivo = simplex[indexLinhaPivo][indexColunaPivo]
    }

    gerarTexto('p', `Identificado o elemento ${elementoPivo} como elemento pivô, encontramos a linha pivô, que é a linha '${indexLinhaPivo + 1}', onde irei dividir toda a linha pelo valor do elemento pivô.`)

    zerarColunaPivô()
    mostrarTabela()
    destacaColunaPivo()
    destacaLinhaPivo()

    gerarTexto('p', `Essa é a tabela após zerar a coluna pivô.`)

    colunaPivo()
    itera++
  }

  if (itera === 0 && condicaoParada === true || itera === 9 && condicaoParada === false) {
    gerarTexto('h2', `Solução Inviável`)
    condicaoCentraliza = true
    gerarTexto('p', `Não foi possível realizar o simplex por N motivos. (Lógica a desenvolver)`)
  } else {
    gerarTexto('h2', `Resultado`)
    mostrarResultados()
  }
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

function setObjetivoFuncao() {
  objetivo = document.getElementById('select-objetivo')

  if (objetivo.value == 2) {
    for (let i = 0; i < simplex.length; i++) {
      for (let j = 0; j < tamanho; j++) {
        simplex[i][j] *= -1
      }
    }
  }
}

function criarFormaPadrao() {
  tamanho = numVariaveis + numRestricao + 3
  inequacao = numVariaveis + numRestricao + 1
  resultado = inequacao + 1

  objetivo = document.getElementById('select-objetivo')

  setObjetivoFuncao()

  for (let i = 0; i < simplex.length; i++) {
    for (let j = 0; j < tamanho; j++) {
      if (i == 0 && j != 0 && j != inequacao) {
        simplex[i][j] *= -1
      }

      if (j == resultado && simplex[i][j] < 0 && objetivo.value == 1) {
        simplex[i][j] *= -1
      }

      if (j == inequacao) {
        simplex[i][j] = '='
      }
    }
  }
}

function mostrarTabela() {
  tabelaSimplex = document.createElement('table')
  tabelaSimplex.id = 'tabela-' + contTabela++
  variaveis = numVariaveis + 1
  folgas = variaveis + numRestricao
  inequacao = folgas
  resultado = inequacao + 1
  let cabecalho = tabelaSimplex.createTHead().insertRow(0)

  for (let i = 0; i < tamanho; i++) {
    if (i == 0) {
      cabecalho.insertCell(i).innerHTML = 'Z'
    } else if (i > 0 && i < variaveis) {
      cabecalho.insertCell(i).innerHTML = `X${i}`
    } else if (i >= variaveis && i < folgas) {
      cabecalho.insertCell(i).innerHTML = `F${i}`
    } else if (i == inequacao) {
      cabecalho.insertCell(i).innerHTML = ''
    } else if (i == resultado) {
      cabecalho.insertCell(i).innerHTML = 'Resultado'
    }
  }

  let linhas = tabelaSimplex.createTBody()

  for (let i = 0; i < numRestricao + 1; i++) {
    let linha = linhas.insertRow(i)
    for (let j = 0; j < tamanho; j++) {
      if (Number.isInteger(simplex[i][j]) == true || simplex[i][j] == '=') {
        linha.insertCell(j).innerHTML = simplex[i][j]
      } else {
        linha.insertCell(j).innerHTML = parseFloat(simplex[i][j]).toFixed(3)
      }
    }
  }

  let gerarTabela = document.getElementById('tabelas-simplex')

  gerarTabela.appendChild(tabelaSimplex)
}

function colunaPivo() {
  objetivo = document.getElementById('select-objetivo')

  if (objetivo.value == 1) {
    let maiorNegativo = 0

    for (let j = 1; j < variaveis; j++) {
      if (simplex[0][j] < maiorNegativo) {
        console.log('Valor sendo analisado' + simplex[0][j])
        maiorNegativo = simplex[0][j]
        console.log('MaiorNegativo = ' + maiorNegativo)
        indexColunaPivo = j
        console.log('IndexColunaPivo = ' + indexColunaPivo)
      }
    }

    if (maiorNegativo >= 0) {
      condicaoParada = true
    }
  } else {
    let menorValor = 9999999
    let auxMenorValor = 0

    for (let j = 1; j < inequacao; j++) {
      auxMenorValor = Math.abs(simplex[0][j])

      if (auxMenorValor < menorValor && auxMenorValor != 0) {
        menorValor = auxMenorValor
        console.log('menorValor = ' + menorValor)
        indexColunaPivo = j
        console.log('IndexColunaPivo = ' + indexColunaPivo)
      }
    }
  }

  if (objetivo.value == 2) {
    condicaoParada = true
  }

  for (let i = 0; i < simplex.length; i++) {
    if (simplex[i][resultado] < 0) {
      condicaoParada = false
    }
  }
  console.log(condicaoParada)
}

function elementosPivo() {
  objetivo = document.getElementById('select-objetivo')

  if (objetivo.value == 1) {
    menorPositivo = 99999999
    let auxMenorPositivo

    for (let i = 1; i < simplex.length; i++) {
      if (simplex[i][resultado] !== 0 || simplex[i][indexColunaPivo] !== 0) {
        auxMenorPositivo = simplex[i][resultado] / simplex[i][indexColunaPivo]
        console.log('b = ' + simplex[i][resultado])
        console.log('elemento pivô = ' + simplex[i][indexColunaPivo])
        console.log('AuxMenorPositivo = ' + auxMenorPositivo)

        if (auxMenorPositivo < menorPositivo && auxMenorPositivo > 0) {
          menorPositivo = auxMenorPositivo
          console.log('É menor, entrou no if e o valor de menorPositivo é ' + menorPositivo)
          indexLinhaPivo = i
          console.log('O index da linha pivô agora é: ' + indexLinhaPivo)
        }
      }
    }
  } else {
    menorSoma = 9999999
    let auxMenorSoma = 0

    for (let i = 1; i < simplex.length; i++) {
      for (let j = 1; j < inequacao; j++) {
        auxMenorSoma += simplex[i][j]
      }

      console.log(`A soma da linha ${i + 1} está em: ${auxMenorSoma}`);

      if (auxMenorSoma < menorSoma) {
        menorSoma = auxMenorSoma
        console.log('menorSoma = ' + menorSoma)
        indexLinhaPivo = i
        console.log('O index da linha pivô agora é: ' + indexLinhaPivo)
      }

      auxMenorSoma = 0
    }
  }
}

function linhaPivo() {
  let elementoPivo = simplex[indexLinhaPivo][indexColunaPivo]

  for (let j = 1; j <= resultado; j++) {
    if (j != inequacao) {
      console.log('Elemento analisado = ' + simplex[indexLinhaPivo][j])
      console.log('Elemento pivô = ' + elementoPivo)
      simplex[indexLinhaPivo][j] = simplex[indexLinhaPivo][j] / elementoPivo
      console.log('Novo valor do elemento = ' + simplex[indexLinhaPivo][j])
    }
  }
}

function zerarColunaPivô() {
  objetivo = document.getElementById('select-objetivo')

  for (let i = 0; i < simplex.length; i++) {
    if (i !== indexLinhaPivo) {
      let multiplicador = simplex[i][indexColunaPivo] * -1
      for (let j = 1; j <= resultado; j++) {
        if (j !== inequacao) {
          let elementoPivo = simplex[indexLinhaPivo][j]
          console.log('Multiplicador é ' + multiplicador)
          if (multiplicador !== 0 || elementoPivo !== 0) {
            console.log('Elemento analisado é ' + simplex[i][j])
            console.log(
              `L${indexLinhaPivo + 1
              } é ${elementoPivo} e o número que multiplica ele é ${multiplicador}`
            )
            console.log('O elemento pivo é ' + elementoPivo)
            simplex[i][j] = multiplicador * elementoPivo + simplex[i][j]
            console.log('O seu resultado agora é ' + simplex[i][j])
          } else {
            console.log('O elemento é igual a 0')
          }
          if (objetivo.value == 2 && i == 0 && contTabela == 4) {
            simplex[i][j] *= -1
          }
        } else {
          console.log('O index é o de sinais')
        }
      }
      if (objetivo.value == 2 && i == 0 && contTabela == 4) {
        simplex[i][0] *= -1
      }
      console.log('------------------- Finalizado a linha ' + (i + 1) + '--------------------')
    } else {
      console.log('O index é o da linha pivô')
    }
    console.log(simplex[i])
  }
}

function mostrarResultados() {
  let resultados = []

  console.log(resultados);

  for (let j = 0; j < tamanho; j++) {
    let contZeros = 0
    let indexLinhaResultado

    for (let i = 0; i < simplex.length; i++) {
      if (simplex[i][j] === 0) {
        contZeros++
      } else if (simplex[i][j] === 1) {
        indexLinhaResultado = i
      }

    }
    if (contZeros === simplex.length - 1 && indexLinhaResultado !== undefined) {
      resultados.push(simplex[indexLinhaResultado][resultado])
    } else {
      resultados.push(0)
    }
  }

  gerarTexto('h3', 'Variáveis Básicas')

  for (let i = 0; i < tamanho; i++) {
    let variavel

    if (i == 0 && resultados[i] !== 0) {
      variavel = 'Z'
    } else if (i < variaveis && resultados[i] !== 0) {
      variavel = `X${i}`
    } else if (i >= variaveis && i < inequacao && resultados[i] !== 0) {
      variavel = `F${i}`
    }

    let resposta = 0

    if (Number.isInteger(resultados[i]) == false) {
      resposta = resultados[i].toFixed(3)
    } else {
      resposta = resultados[i]
    }

    if (variavel !== undefined) {
      gerarTexto('p', `${variavel} = ${resposta}`)
    }
  }

  gerarTexto('h3', 'Variáveis Não-Básicas')

  for (let i = 0; i < tamanho; i++) {
    let variavel

    if (i < variaveis && resultados[i] === 0) {
      variavel = `X${i}`
    } else if (i >= variaveis && i < inequacao && resultados[i] === 0) {
      variavel = `F${i}`
    }

    if (variavel !== undefined) {
      gerarTexto('p', `${variavel} = ${0}`)
    }
  }
}

function gerarTexto(tag, texto) {
  let elemento = document.createElement(tag)
  elemento.innerHTML = texto

  if (condicaoCentraliza === true) {
    elemento.style.marginLeft = 'auto'
    elemento.style.marginRight = 'auto'
  }

  let gerarTexto = document.getElementById('tabelas-simplex')
  gerarTexto.appendChild(elemento)
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

function destacaColunaPivo() {
  let tabelaColunaPivo = document.getElementById(`tabela-${contTabela - 1}`)
  let corpoTabela = tabelaColunaPivo.querySelector('tbody')

  for (let i = 0; i < simplex.length; i++) {
    let linhaTabela = corpoTabela.children[i]
    let celulaColunaPivo = linhaTabela.children[indexColunaPivo]
    celulaColunaPivo.style.backgroundColor = '#0d4c5f'
  }
}

function destacaLinhaPivo() {
  let tabelaLinhaPivo = document.getElementById(`tabela-${contTabela - 1}`)
  let corpoTabela = tabelaLinhaPivo.querySelector('tbody')

  for (let i = 0; i < simplex.length; i++) {
    if (i === indexLinhaPivo) {
      let linhaTabela = corpoTabela.children[i]
      linhaTabela.style.backgroundColor = '#0d4c5f'
    }
  }
}