import express, { type Request, type Response } from "express"
import swaggerUi from "swagger-ui-express"
import doc from "./docs/openapi.js"
import cors from "cors"
import libraryRoutes from './routes/library.js'

const app = express()
const PORT = 3000
app.use(express.json())
app.use(cors())

app.use(libraryRoutes)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(doc))
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
  console.log(`Swagger: http://localhost:${PORT}/swagger`)
})

