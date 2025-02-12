import { CloseCircleTwoTone } from '@ant-design/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[400px] shadow-lg'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
          <button onClick={onClose}>
            <CloseCircleTwoTone twoToneColor='#ff4d4f' />
          </button>
        </div>

        <p className='text-gray-700 my-4'>{description}</p>

        <div className='flex justify-end gap-4 mt-4'>
          <button
            className='px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
