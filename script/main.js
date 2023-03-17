
const form = document.querySelector("#form")
const hideForm = document.querySelector("#hideForm") 
const resultText = document.querySelector("#resultText")

const name = document.querySelector("#name")
const monthly = document.querySelector("#monthly")
const monthlyDecimal = document.querySelector("#monthlyDecimal")
const tax = document.querySelector("#tax")
const taxDecimal = document.querySelector("#taxDecimal")
const time = document.querySelector("#time")

form.onsubmit = submitForm

async function submitForm(e) {
  e.preventDefault()
  let temErro = false

  if(!form.name.value) {
    temErro = true
    form.name.classList.add('inputError')
  } else {
    form.name.classList.remove('inputError')
    form.name.placeholder = ''
  }

  if(!form.monthly.value || !form.monthlyDecimal.value) {
    temErro = true
    form.monthly.classList.add('inputError')
    form.monthlyDecimal.classList.add('inputError')
  } else {
    form.monthly.classList.remove('inputError')
    form.monthlyDecimal.classList.remove('inputError')
    form.monthly.placeholder = ''
  }

  if(!form.tax.value || !form.taxDecimal.value) {
    temErro = true
    form.tax.classList.add('inputError')
    form.taxDecimal.classList.add('inputError')
  } else {
    form.tax.classList.remove('inputError')
    form.taxDecimal.classList.remove('inputError')
    form.tax.placeholder = ''
  }

  if(!form.time.value) {
    temErro = true
    form.time.classList.add('inputError')
  } else {
    form.time.classList.remove('inputError')
    form.time.placeholder = ''
  }
  
  function transformarEmJson(response) {
    return response.json()
  }
  
  function exibirNaTela(response) {   
    hideForm.classList.add('hidden')
    resultText.classList.remove('hidden')
    
    const result = response.result
    
    resultText.innerHTML =
    `
      Olá <strong>${form.name.value}</strong>, investindo <strong>R$${form.monthly.value},${form.monthlyDecimal.value}</strong> todo mês, você terá <strong>R$ ${parseFloat(result).toFixed(2).replace('.', ',')}</strong> em <strong>${form.time.value}</strong> meses sob uma taxa de juros de <strong>${form.tax.value},${form.taxDecimal.value} %</strong> ao mês.

      <button class="buttonRec" id="buttonRec">Recalcular</button>
    `
  }

  function exibirErro(err) {
    console.log('Ops, deu erro!', err)
  }

  if(!temErro) {

    const monthlyTransform = `${monthly.value}.${monthlyDecimal.value}`
    const taxTransform = `${tax.value}.${taxDecimal.value}`
    
    await fetch('http://api.mathjs.org/v4/', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: ` 
      { "expr": "${monthlyTransform} * (((1 + ${taxTransform}/100) ^ ${time.value} - 1) / (${taxTransform}/100))"
      }
      `
    })
      .then(transformarEmJson)    
      .then(exibirNaTela)    
      .catch(exibirErro)    
      
      const buttonRec = document.querySelector('#buttonRec')
      
      buttonRec.onclick = reloadPage = (e) => {
        e.preventDefault()
    
        window.location.reload();
    
      }
      
    }
  }
  