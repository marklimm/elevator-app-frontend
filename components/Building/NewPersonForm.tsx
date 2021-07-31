import React, { FunctionComponent, useState } from 'react'

interface NewPersonFormProps {
  onSpawnNewPerson: () => void
}

/**
 * The form that allows users to spawn a new person (that will go on the elevator)
 * @param param0
 * @returns
 */
export const NewPersonForm: FunctionComponent<NewPersonFormProps> = ({
  onSpawnNewPerson,
}: NewPersonFormProps) => {
  const [newPersonName, setNewPersonName] = useState<string>('')
  const [confirmationMessage, setConfirmationMessage] = useState<string>('')

  const onNewPersonNameTextChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setNewPersonName(event.target.value)
  }

  const formSubmitted = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()

    onSpawnNewPerson(newPersonName)

    //  show a confirmation message and hide it after a few seconds
    setConfirmationMessage(`${newPersonName} has been spawned!`)
    setTimeout(() => {
      setConfirmationMessage('')
    }, 5000)

    //  reset the textbox
    setNewPersonName('')
  }

  return (
    <>
      <h1 className='text-xl mt-5 mb-3'>Spawn a new person</h1>

      <form onSubmit={formSubmitted}>
        <input
          type='text'
          className='focus:outline-none focus:ring focus:border-blue-400 border-gray-500 border-2 p-1 rounded-md shadow-md'
          value={newPersonName}
          onChange={onNewPersonNameTextChange}
          placeholder="Person's name"
        />

        <button
          type='submit'
          className='ml-5 bg-blue-400 text-white p-2 disabled:opacity-50'
          disabled={newPersonName.length === 0}
        >
          Add New Person
        </button>
      </form>

      {confirmationMessage.length > 0 && (
        <div className=' text-green-600 mt-3'>{confirmationMessage}</div>
      )}
    </>
  )
}
