import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { format, toDate } from 'date-fns'

/**
 * A key-value mapping of {elevatorId/userId}: an array of log messages for the elevator/user in question
 */
export interface UpdatesState {
  [key: string]: FormattedUpdate[]
}

export const updatesInitialState: UpdatesState = {}

interface AnUpdate {
  id: string
  timestamp: number
  text: string
}

export interface FormattedUpdate {
  id: string
  formattedTime: string
  text: string
}

const updatesSlice = createSlice({
  name: 'updates',
  initialState: updatesInitialState,
  reducers: {
    addUpdate(state, action: PayloadAction<AnUpdate>) {
      const { id, text, timestamp } = action.payload

      if (!state[id]) {
        state[id] = []
      }

      const date = toDate(timestamp)

      const formattedTime = format(date, 'pp')

      state[id].unshift({
        id,
        formattedTime,
        text,
      })
    },
  },
})

export const { addUpdate } = updatesSlice.actions

export default updatesSlice.reducer
