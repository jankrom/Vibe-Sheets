import * as fs from "fs/promises" // Import the promises-based fs module for async operations
import path from "path" // Import path for resolving file paths
import { fileURLToPath } from "url" // For ES Modules to get __dirname equivalent
import { BaseMessage } from "@langchain/core/messages" // Importing types for messages

// __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const messagesFilePath = path.join(__dirname, "messages.json")

// Define your Message and MessagesJson types
type MessagesJson = { messages: BaseMessage[] }

// Function to read messages from the file
// This makes sure we always read the latest state from disk
const readMessagesFromFile = async (): Promise<MessagesJson> => {
  try {
    const data = await fs.readFile(messagesFilePath, "utf8")
    return JSON.parse(data) as MessagesJson
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If file doesn't exist, return an empty messages object
      console.warn(
        `File not found at ${messagesFilePath}. Initializing with empty messages.`
      )
      return { messages: [] }
    }
    console.error(`Error reading messages.json: ${error}`)
    throw error
  }
}

// Function to write messages to the file
const writeMessagesToFile = async (data: MessagesJson): Promise<void> => {
  try {
    await fs.writeFile(messagesFilePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error(`Error writing messages.json: ${error}`)
    throw error
  }
}

export const QUERIES = {
  getAllMessages: async (): Promise<BaseMessage[]> => {
    const data = await readMessagesFromFile()
    return data.messages
  },
}

export const MUTATIONS = {
  addMessage: async (message: BaseMessage): Promise<BaseMessage> => {
    // Read the current state from the file
    const currentData = await readMessagesFromFile()
    currentData.messages.push(message)

    // Write the updated state back to the file
    await writeMessagesToFile(currentData)

    return message
  },
  setMessages: async (messages: BaseMessage[]): Promise<void> => {
    await writeMessagesToFile({ messages })
  },
}
