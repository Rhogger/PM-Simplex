const numVariaveis = Number(prompt('Quantas variáveis de decisão tem o problema?'))
const numRestricao = Number(prompt('Quantas restrições tem no problema?'))
const objetivoFuncao = Number(
	prompt(`
Qual o objetivo da função?

1 - Maximizar
2 - Minimizar
`)
)

// Tamanho de função
let tamanho = numVariaveis + numRestricao + 2

// Função Objetiva
let z = []
z.length = tamanho

// Forma Padrão
let simplex = []

// Variaveis de controle
// Contador da Restrição para impressão
let contRestricao = 1
// Contador da Restrição para comparação
let contRestricao2 = 1
// Contador da folga
let contFolga
// Valor da folga
let valorFolga
// Posição limite das variaveis X
let variaveis = numVariaveis - 1
// Posição limite das folgas F
let folgas = numVariaveis + numRestricao - 1
// Posição específica dos sinais <=, = ou >=
let sinais = numVariaveis + numRestricao
// Posição específica do resultado b
let resultado = numVariaveis + numRestricao + 1
// Variavel para condicação de parada
let condicaoParada = false

// Variaveis para processos da coluna pivô
// Refere-se ao maior número negativo absoluto na linha 1, onde Z = 1
let maiorNegativo = Number()
// Refere-se ao index desse número acima, ou seja, o index da coluna pivô
let indexColunaPivo = Number()

// Variaveis para processo dos elementos pivô
// Refere-se ao resultado da divisão do b e possível elemento pivô, se tornando no fim, o proprio elemento pivô
let menorPositivo = Number()
// Auxiliar da variavel acima
let auxMenorPositivo
// Refere-se ao index do elemento pivô, ou seja, a linha pivô
let indexLinhaPivo = Number()

setObjetiva()

for (let i = 0; i < numRestricao; i++) {
	setRestricao()
	contRestricao2++
	console.log(simplex)
}

console.log(z)
transformarIgualdade()
console.log(simplex)

colunaPivo()
console.log(simplex)

let itera = 0

while (condicaoParada === false && itera < 10) {
	elementosPivo()
	console.log(simplex)
	// OK ATÉ AQUI
	linhaPivo()
	console.log(simplex)
	zerarColunaPivô()
	console.log(simplex)
	colunaPivo()
	console.log(simplex)
	itera++
}

// Função que define os valores na função objetiva
function setObjetiva() {
	for (let i = 0; i < numVariaveis; i++) {
		z[i] = Number(
			prompt(`
    Função Objetiva

    Quantidade de X${i + 1}
    `)
		)

		z[i] *= -1
	}

	for (let i = variaveis + 1; i <= folgas; i++) {
		valorFolga = 0
		z[i] = Number(valorFolga)
	}

	z[sinais] = '='
	z[resultado] = 0

	console.log(z)
	setObjetivoFuncao()
	console.log(z)

	simplex.push(z)
}

// Função que define os valores das restrições
function setRestricao() {
	contFolga = 0
	valorFolga = 2

	// Restrições
	let restricao = []
	restricao.length = tamanho

	for (let i = 0; i < restricao.length; i++) {
		if (i <= variaveis) {
			restricao[i] = Number(
				prompt(`
      Restrição ${contRestricao}

      Quantidade de X${i + 1}`)
			)
		} else if (i === sinais) {
			let igualdade
			let condicao

			do {
				igualdade = String(
					prompt(`
        Restrição ${contRestricao}
    
        Selecione o tipo do sinal de igualdade: 
    
        1 - <=
        2 - =
        3 - >=
    `)
				)

				if (igualdade === '1') {
					igualdade = '<='
				} else if (igualdade === '2') {
					igualdade = '='
				} else if (igualdade === '3') {
					igualdade = '>='
				} else {
					alert('Opção inválida.')
				}

				condicao = igualdade != '<=' && igualdade != '=' && igualdade != '>='
			} while (condicao)

			restricao[i] = igualdade
		} else if (i === resultado) {
			restricao[i] = Number(
				prompt(`
        Restrição ${contRestricao}

        Resultado(b) da equação: `)
			)

			if (restricao[i] < 0) {
				for (let j = 0; j < restricao.length; j++) {
					if (j !== sinais) {
						restricao[j] *= -1
					}
				}
			}
		}
	}

	for (let i = variaveis + 1; i <= folgas; i++) {
		contFolga++

		if (restricao[sinais] === '<=' && i - variaveis === contRestricao2) {
			valorFolga = 1
		} else if (restricao[sinais] === '=' && i - variaveis === contRestricao2) {
			valorFolga = 0
		} else if (restricao[sinais] === '>=' && i - variaveis === contRestricao2) {
			valorFolga = -1
		} else {
			valorFolga = 0
		}

		alert(`
    Restrição ${contRestricao}

    Quantidade de F${contFolga} é igual a ${valorFolga}`)
		restricao[i] = Number(valorFolga)
	}

	simplex.push(restricao)
	contRestricao++
}

function setObjetivoFuncao() {
	if (objetivoFuncao === 2) {
		for (let i = 0; i < z.length; i++) {
			if (i !== sinais) {
				z[i] *= -1
			}
		}
	}
}

function transformarIgualdade() {
	for (let i = 0; i < simplex.length; i++) {
		for (let j = 0; j <= resultado; j++) {
			if (j == sinais) {
				simplex[i][j] = '='
			}
		}
	}
}

function colunaPivo() {
	maiorNegativo = 0

	for (let j = 0; j < sinais; j++) {
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
	console.log(condicaoParada)
}

function elementosPivo() {
	menorPositivo = 99999999999999999999999

	for (let i = 1; i < simplex.length; i++) {
		if (simplex[i][resultado] !== 0 || simplex[i][indexColunaPivo] !== 0) {
			auxMenorPositivo = simplex[i][resultado] / simplex[i][indexColunaPivo]
			console.log('AuxMenorPositivo = ' + auxMenorPositivo)
			console.log('b = ' + simplex[i][resultado])
			console.log('elemento pivô = ' + simplex[i][indexColunaPivo])

			if (auxMenorPositivo < menorPositivo && auxMenorPositivo > 0) {
				menorPositivo = auxMenorPositivo
				console.log('É menor, entrou no if e o valor de menorPositivo é ' + menorPositivo)
				indexLinhaPivo = i
				console.log('O index da linha pivô agora é: ' + indexLinhaPivo)
			}
		}
	}
}

function linhaPivo() {
	let elementoPivo = simplex[indexLinhaPivo][indexColunaPivo]

	for (let j = 0; j <= resultado; j++) {
		if (j !== sinais) {
			console.log('Elemento analisado = ' + simplex[indexLinhaPivo][j])
			simplex[indexLinhaPivo][j] = simplex[indexLinhaPivo][j] / elementoPivo
			console.log('Novo valor do elemento = ' + simplex[indexLinhaPivo][j])
			console.log('Elemento pivô = ' + elementoPivo)
		}
	}
}

// NÃO MEXER, ESTÁ PRONTA
function zerarColunaPivô() {
	for (let i = 0; i < simplex.length; i++) {
		if (i !== indexLinhaPivo) {
			const multiplicador = simplex[i][indexColunaPivo] * -1
			for (let j = 0; j <= resultado; j++) {
				if (j !== sinais) {
					let elementoPivo = simplex[indexLinhaPivo][j]
					console.log('Multiplicador é ' + multiplicador)
					if (multiplicador !== 0 || elementoPivo !== 0) {
						console.log('Elemento analisado é ' + simplex[i][j])
						console.log(
							`L${
								indexLinhaPivo + 1
							} é ${elementoPivo} e o número que multiplica ele é ${multiplicador}`
						)
						console.log('O elemento pivo é ' + elementoPivo)
						simplex[i][j] = multiplicador * elementoPivo + simplex[i][j]
						console.log('O seu resultado agora é ' + simplex[i][j])
					} else {
						console.log('O elemento é igual a 0')
					}
				} else {
					console.log('O index é o de sinais')
				}
			}
			console.log('------------------- Finalizado a linha ' + (i + 1) + '--------------------')
		} else {
			console.log('O index é o da linha pivô')
		}
		console.log(simplex[i])
	}
}
