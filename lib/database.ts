import mongoose from 'mongoose'


const { MONGO_CONNECTION_STRING } = process.env

let isConnected = false
let connectionPromise: Promise<unknown> | null = null

// Create a connection promise that resolves when connected
function connectToDatabase() {
    if (connectionPromise) {
        return connectionPromise
    }

    connectionPromise = new Promise((resolve, reject) => {
        if (isConnected) {
            resolve(mongoose.connection)
            return
        }

        mongoose.connect(MONGO_CONNECTION_STRING as string)
        mongoose.set('debug', false)

        mongoose.connection.on('connected', () => {
            console.info('Mongo connection successful')
            isConnected = true
            resolve(mongoose.connection)
        })

        mongoose.connection.on('error', (error) => {
            console.error('Mongo connection failed:', error)
            isConnected = false
            connectionPromise = null
            reject(new Error('Mongo connection failed'))
        })

        mongoose.connection.on('disconnected', () => {
            console.info('Mongo connection disconnected')
            isConnected = false
            connectionPromise = null
        })
    })

    return connectionPromise
}

// Ensure database is connected before executing queries
async function ensureConnection() {
    if (!isConnected) {
        await connectToDatabase()
    }
    return mongoose.connection
}

function close() {
    isConnected = false
    connectionPromise = null
    return mongoose.disconnect()
}

export { close, mongoose, ensureConnection, connectToDatabase }
export default mongoose
