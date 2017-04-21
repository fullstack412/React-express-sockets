const io = require('../index').io
const Answers = require('../db/models/answers')

module.exports.postAnswer = (socket, action) => {
  const { message, user_id, question_id } = action
  Answers.insertAnswer({message, user_id, question_id})
    .then(({id}) => Answers.selectIndividualAnswer(id))
    .then((answer) => {
      io.to(question_id).emit('action', {
        type: 'SUCCESSFUL_POST_ANSWER',
        data: answer
      })
    })
    .catch(error => {
      console.log(`Error: ${error}`)
      socket.emit({
        type: 'FAILED_POST_ANSWER',
        error: 'Failed to insert answer into DB'
      })
    })
}

module.exports.updateAnswer = (socket, action) => {
  Answers.updateAnswer(action)
  .then(() => {
    io.to(action.question_id).emit('action', { type: 'UPDATE_ANSWER_SUCCESS', data: action })
  })
  .catch(error => {
    console.log(`Failed to update answer ${error}`)
    socket.emit('action', { type: 'UPDATE_ANSWER_FAILURE', error: `Failed to update answer ${error}` })
  })
}
