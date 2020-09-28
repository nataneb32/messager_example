export const createMessage = ({id, username, body, sendedAt}) => {
  return {
    id: id,
    username: username,
    body: body,
    sendedAt: sendedAt
  }
}
