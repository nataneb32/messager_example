import {Schema,model} from "mongoose"
import {createMessage} from "../model/message"

const MessageSchema = Schema({
  username: String,
  body: String
}, { timestamps: { createdAt: 'sendedAt' } })

const MessageModel = model('message', MessageSchema)


function fromModelToDB(model) {
    if(!model._id) return {}
    model._id = model.id
    delete model.id
    return model
}

function fromDBToModel(doc) {
  return createMessage({
    ...doc,
    id: doc._id
  })
}

export const createMessageRepository = () => {
  return {
    async createMessage(message){
      const newMsg = await MessageModel.create(message)
      return fromDBToModel(newMsg)
    },
    async getMessages(message){
      const messages = await MessageModel.find(fromModelToDB(message)).lean()
      console.log(messages)
      return messages.map(doc => fromDBToModel(doc))
    }
  }
}
