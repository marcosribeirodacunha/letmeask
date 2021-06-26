import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import { ReactComponent as LikeIcon } from '../assets/images/like.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Questions'
import { RoomCode } from '../components/RoomCode'

import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function Room() {
  const [newQuestion, setNewQuestion] = useState('')

  const { id: roomId } = useParams<RoomParams>()
  const { user } = useAuth()
  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') return;
    if (!user) {
      toast.error("You must be logged in")
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false,
    }

    await database.ref(`/rooms/${roomId}/questions`).push(question)
    toast.success('Question registered successfully!')

    setNewQuestion('')

  }

  async function handleLikeQuestion(questionId: string, likeId?: string) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      })
    }
  }

  return (
    <div id="page-room">
      <header>
        <div>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <RoomCode code={roomId} />
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type='submit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {question.isAnswered || (
                  <button
                    type='button'
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <LikeIcon />
                  </button>
                )}
              </Question>
            ))}
          </div>
        ) : (
          <div className="empty-questions">
            <img src={emptyQuestionsImg} alt="Ilustração de balões de mensagem" />
            <h2>Nenhuma pergunta por aqui...</h2>
            <p>Faça o seu login e seja a primeira pessoa a fazer uma pergunta!</p>
          </div>
        )}
      </main>
    </div>
  )
}