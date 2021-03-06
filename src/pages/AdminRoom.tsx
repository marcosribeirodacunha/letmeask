import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import logoImg from '../assets/images/logo.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import { ReactComponent as CheckIcon } from '../assets/images/check.svg'
import { ReactComponent as AnswerIcon } from '../assets/images/answer.svg'
import { ReactComponent as DeleteIcon } from '../assets/images/delete.svg'
import { ReactComponent as CircleCloseIcon } from '../assets/images/circle-close.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Questions'
import { RoomCode } from '../components/RoomCode'
import { Modal } from '../components/Modal'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const [IsEndRoomModalOpen, setIsEndRoomModalOpen] = useState(false)
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState(-1)

  const { id: roomId } = useParams<RoomParams>()
  const { questions, title } = useRoom(roomId)

  const history = useHistory()

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion() {
    if (questionToDelete < 0) return;
    const questionId = questions[questionToDelete].id

    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()

      setIsDeleteModalOpen(false);
      setQuestionToDelete(-1);

      toast.success('Questions deleted successfully!')
    } catch (error) {
      toast.error('Sorry, something was wrong. Please, try again.')
    }
  }

  async function handleCheckQuestionsAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  return (
    <div id="page-room">
      <header>
        <div>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <div>
              <RoomCode code={roomId} />
              <Button
                variant='outline-small'
                onClick={() => setIsEndRoomModalOpen(true)}
              >
                Encerrar sala
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map((question, index) => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {question.isAnswered || (
                  <>
                    <button
                      type='button'
                      title='Check message as answered'
                      onClick={() => handleCheckQuestionsAsAnswered(question.id)}>
                      <CheckIcon />
                    </button>

                    <button
                      type='button'
                      title='Highlight message'
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <AnswerIcon />
                    </button>
                  </>
                )}

                <button
                  type='button'
                  className='delete'
                  title='Delete message'
                  onClick={() => {
                    setIsDeleteModalOpen(true)
                    setQuestionToDelete(index)
                  }}>
                  <DeleteIcon />
                </button>
              </Question>
            ))}
          </div>
        ) : (
          <div className="empty-questions">
            <img src={emptyQuestionsImg} alt="Ilustra????o de bal??es de mensagem" />
            <h2>Nenhuma pergunta por aqui...</h2>
            <p>Envie o c??digo desta sala para seus amigos e comece a responder perguntas!</p>
          </div>
        )}
      </main>

      <Modal
        isOpen={IsDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        icon={DeleteIcon}
        title='Excluir pergunta'
        message='Tem certeza que voc?? deseja excluir esta pergunta?'
        action={{
          title: 'Sim, excluir',
          handler: handleDeleteQuestion
        }}
      />

      <Modal
        isOpen={IsEndRoomModalOpen}
        onRequestClose={() => setIsEndRoomModalOpen(false)}
        icon={CircleCloseIcon}
        title='Encerrar sala'
        message='Tem certeza que voc?? deseja encerrar esta sala?'
        action={{
          title: 'Sim, encerrar',
          handler: handleEndRoom
        }}
      />
    </div>
  )
}