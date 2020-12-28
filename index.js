/* global Highcharts */

function update () {
  const config = configFromUi()
  const series = buildSeries(config)

  updateChart(series)
}

function configFromUi () {
  const config = {
    vorlaufLow: document.getElementById('vorlauf-low').valueAsNumber,
    vorlaufHigh: document.getElementById('vorlauf-high').valueAsNumber,
    vorlaufLift: document.getElementById('vorlauf-lift').valueAsNumber,
    vorlaufMin: document.getElementById('vorlauf-min').valueAsNumber,
    vorlaufMax: document.getElementById('vorlauf-max').valueAsNumber
  }

  return config
}

function interpolateY (x, x0, y0, x1, y1) {
  return y0 + (x - x0) * (y1 - y0) / (x1 - x0)
}

function clamp (v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function calculateY (x, config) {
  const rateLow = 0.5 - config.vorlaufLift * 0.01
  const rateHigh = 1.0 - rateLow
  const lift = config.vorlaufLow * rateLow + config.vorlaufHigh * rateHigh
  let y

  if (x < 0) {
    y = interpolateY(x, 0, lift, -20, config.vorlaufHigh)
  } else {
    y = interpolateY(x, 20, config.vorlaufLow, 0, lift)
  }

  return clamp(y, config.vorlaufMin, config.vorlaufMax)
}

function buildSeries (config) {
  const vorlauf = []

  for (let x = 40; x >= -40; x--) {
    vorlauf.push([x, calculateY(x, config)])
  }

  return { vorlauf }
}

function updateChart (series) {
  Highcharts.chart('chart', {
    chart: {
      type: 'line',
      height: '500px',
      animation: false
    },
    title: {
      text: 'Heizkurve'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Außentemperatur'
      },
      reversed: true,
      min: -40,
      max: 40
    },
    yAxis: {
      title: {
        text: 'Wassertemperatur'
      },
      min: 0,
      max: 100
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false
        }
      },
      series: {
        animation: false
      }
    },
    tooltip: {
      formatter: function () {
        return [
          `Außentemperatur: <b>${this.x}</b>`,
          `Vorlauftemperatur: <b>${this.y}</b>`
        ].join('<br>')
      }
    },
    series: [{
      name: 'Vorlauf',
      data: series.vorlauf
    }]
  })
}

update()

for (const element of document.querySelectorAll('[data-update]')) {
  element.onchange = update
}
