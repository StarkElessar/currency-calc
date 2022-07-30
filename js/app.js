document.addEventListener('DOMContentLoaded', () => {
  const requestMinskUrl = 'https://belarusbank.by/api/kursExchange?city=Минск'
  const requestNBRBUrl = 'https://www.nbrb.by/api/exrates/rates?periodicity=0'
  const requestRFUrl = 'https://www.cbr-xml-daily.ru/daily_json.js'
  const displayUSD = document.querySelector('[data-value="USD"]')
  const displayEUR = document.querySelector('[data-value="EUR"]')
  const displayUAH = document.querySelector('[data-value="UAH"]')
  const giveBYN = document.querySelector('#give-byn')
  const giveUSD = document.querySelector('#give-usd')
  const getResult_1 = document.querySelector('#get-input-1')
  const getResult_2 = document.querySelector('#get-input-2')
  const select_1 = document.querySelector('#select-1')
  const select_2 = document.querySelector('#select-2')
  const state = {}

  getData(requestNBRBUrl)

  async function getData(url) {
    try {
      const response = await fetch(url)
      const result = await response.json()

      for (let i = 0; i < result.length; i++) {
        state[result[i].Cur_Abbreviation] = result[i]
      }
    } catch (error) {
      console.error(error)
    } finally {
      displayUSD.textContent = `${state.USD.Cur_OfficialRate} Br`
      displayEUR.textContent = `${state.EUR.Cur_OfficialRate} Br`
      displayUAH.textContent = `${state.UAH.Cur_OfficialRate} Br`
      
      exchangeBYNRateCalc()
      exchangeUSDRateCalc()
    }
  }
  giveBYN.addEventListener('input', exchangeBYNRateCalc)
  giveUSD.addEventListener('input', exchangeUSDRateCalc)
  select_1.addEventListener('change', exchangeBYNRateCalc)
  select_2.addEventListener('change', exchangeUSDRateCalc)

  function exchangeBYNRateCalc() {
    if (select_1.value === 'UAH') {
      getResult_1.value = (Number(giveBYN.value) / (state[select_1.value].Cur_OfficialRate / 100)).toFixed(2)
    } else {
      getResult_1.value = (Number(giveBYN.value) / state[select_1.value].Cur_OfficialRate).toFixed(2)
    }
  }

  function exchangeUSDRateCalc() {
    switch (select_2.value) {
      case 'BYN':
        return getResult_2.value = Number(giveUSD.value) * state.USD.Cur_OfficialRate
      case 'UAH':
        const $_1_BYN_TO_UAH = 100 / state[select_2.value].Cur_OfficialRate
        const $_ALL_BYN = Number(giveUSD.value) * state.USD.Cur_OfficialRate

        return getResult_2.value = ($_ALL_BYN * $_1_BYN_TO_UAH).toFixed(2)
      default:
        return
    }
  }
})