import ReactModal from 'react-modal'

import { Button } from '../Button';

import './styles.scss'

type ModalProps = {
  isOpen: boolean;
  onRequestClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  message: string;
  action: {
    title: string;
    handler: () => void;
  }
}

ReactModal.setAppElement('#root');

export function Modal({ isOpen, onRequestClose, icon: Icon, title, message, action }: ModalProps) {
  return (
    <ReactModal
      className='react-modal'
      overlayClassName='react-modal__overlay'
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Icon />
      <h2>{title}</h2>
      <p>{message}</p>

      <div>
        <Button variant='neutral' onClick={onRequestClose}>Cancelar</Button>
        <Button variant='danger' onClick={action.handler}>{action.title}</Button>
      </div>

    </ReactModal>
  )
}