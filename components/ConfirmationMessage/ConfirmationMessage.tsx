import React, { FunctionComponent } from 'react'

import { OkOrError } from 'lib/types/ElevatorAppTypes'

interface ConfirmationMessageProps {
  status: OkOrError
  message: string
}

/**
 * Displays a success or error feedback message to the user
 * @param param0
 * @returns
 */
export const ConfirmationMessage: FunctionComponent<ConfirmationMessageProps> =
  ({ status, message }: ConfirmationMessageProps) => {
    return (
      <>
        <div
          className={`${
            status === OkOrError.Ok ? 'text-green-600' : 'text-red-600'
          } mt-3`}
        >
          {message}
        </div>
      </>
    )
  }
