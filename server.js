import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('combined'))
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist/css'))
app.use(express.static('node_modules/highcharts'))

app.listen(8080, () => {
  console.log('listening at http://localhost:8080/')
})
