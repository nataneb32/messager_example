import { createMessage } from '../model/message'

/*
 *
 *
 *
 *
 *
 *
 *
 *
 */

export const createMessageService = (messageRepo) => {
  async function saveMessage (message) {
    await messageRepo.createMessage(message)
  }

  return {
    async sendMessage (msg, broadcast) {
      const message = createMessage(msg)
      broadcast(message)
      await saveMessage(message)
    },
    async getMessages (from, to) {
      return await messageRepo.getAllMessagesByDate(from, to)
    }
  }
}
