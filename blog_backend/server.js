import exp from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import { userApp } from './APIs/UserApi.js'
import { articleApp } from './APIs/ArticleApi.js'
import { adminApp } from './APIs/AdminApi.js'
import { authorApp } from './APIs/AuthorApi.js'
import { commonApp } from './APIs/CommonApi.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

const app = exp()

const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174','https://capstone-project-mu-umber.vercel.app']
const envOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim()).filter(Boolean)
  : []
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests and configured browser origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
//middlewares
app.use(cookieParser())
app.use(exp.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
    dbConnected: mongoose.connection.readyState === 1,
    dbName: mongoose.connection.name || null,
  })
})

//path level middleware
app.use("/user-api", userApp)
app.use("/article-api", articleApp)
app.use("/admin-api", adminApp)
app.use("/author-api", authorApp)
app.use("/auth", commonApp)


// Start the API even if DB is unavailable so local development can continue.
const startServer = async () => {
  const PORT = process.env.PORT || 5000

  const dbUrl = process.env.DB_URL
  if (!dbUrl) {
    console.log('DB_URL is not set. Starting server without DB connection.')
  } else {
    try {
      await mongoose.connect(dbUrl)
      console.log('Connected to DB')
    } catch (err) {
      console.log('DB connection error. Continuing without DB:', err.message)
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()


//invalid path middleware
app.use((req, res) => {
  res.status(404).json({
    message: `Path ${req.url} is invalid`
  })
})


//global error handler
//Error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ",err)
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError")
    return res.status(400).json({ message: "error occurred", error: err.message });
  //CastError
  if (err.name === "CastError")
    return res.status(400).json({ message: "error occurred", error: err.message });
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});
