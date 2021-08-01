import React, { FunctionComponent, useState } from 'react'

import { OkOrError, PersonUpdateResponse } from 'lib/types/ElevatorAppTypes'
import { ConfirmationMessage } from 'components/ConfirmationMessage/ConfirmationMessage'

interface NewPersonFormProps {
  onSpawnNewPerson: (
    string,
    onResponse: (personUpdateResponse: PersonUpdateResponse) => void
  ) => void
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
  const [confirmationMessageStatus, setConfirmationMessageStatus] =
    useState<OkOrError>(OkOrError.Ok)

  const onNewPersonNameTextChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setNewPersonName(event.currentTarget.value)
  }

  const formSubmitted = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    //  show a confirmation message and hide it after a few seconds
    setConfirmationMessage(`Attempting to spawn ${newPersonName} ...`)

    onSpawnNewPerson(
      newPersonName,
      (personUpdateResponse: PersonUpdateResponse) => {
        console.log('server response to spawnnewperson', personUpdateResponse)

        if (
          personUpdateResponse.error ||
          personUpdateResponse.status === OkOrError.Error
        ) {
          console.error(
            `An error was returned from the server: ${personUpdateResponse.error}`
          )

          setConfirmationMessage(personUpdateResponse.error)
          setConfirmationMessageStatus(OkOrError.Error)

          return
        }

        setConfirmationMessage(`${newPersonName} was spawned!`)
        setConfirmationMessageStatus(OkOrError.Ok)

        //  reset the textbox
        setNewPersonName('')
      }
    )
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
        <ConfirmationMessage
          status={confirmationMessageStatus}
          message={confirmationMessage}
        />
      )}
    </>
  )
}
