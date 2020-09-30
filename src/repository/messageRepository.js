import { Schema, model } from 'mongoose'
import { createMessage } from '../model/message'

const MessageSchema = Schema({
  username: String,
  body: String
}, { timestamps: { createdAt: 'sendedAt' } })

const MessageModel = model('message', MessageSchema)

function fromModelToDB (model) {
  if (!model._id) return {}
  model._id = model.id
  delete model.id
  return model
}

function fromDBToModel (doc) {
  return createMessage({
    ...doc,
    id: doc._id
  })
}

export const createMessageRepository = () => {
  async function createMessage (message) {
    const newMsg = await MessageModel.create(message)
    return fromDBToModel(newMsg)
  }

  async function getMessages (message) {
    const messages = await MessageModel.find(fromModelToDB(message)).lean()
    return messages.map(doc => fromDBToModel(doc))
  }

  async function getAllMessagesByDate (from, to) {
    const msgs = await MessageModel.find({ sendedAt: { $gte: from, $lt: to } }).sort({ sendedAt: 1 }).lean()
    return msgs.map(doc => fromDBToModel(doc))
  }

  return {
    createMessage,
    getMessages,
    getAllMessagesByDate
  }
}
