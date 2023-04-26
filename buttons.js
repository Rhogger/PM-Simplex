function desabilitaBtnResolver() {
  let btnResolver = document.getElementById('btn-resolver-problema')
  btnResolver.setAttribute('disabled', null)
  btnResolver.style.backgroundColor = '#ffffff1a'
  btnResolver.style.opacity = 0.75

  desabilitaBtnRestricoes()
}