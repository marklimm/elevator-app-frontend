import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * A key-value mapping of {elevatorId/userId}: an array of log messages for the elevator/user in question
 */
export interface UpdatesState {
  [key: string]: string[]
}

export const updatesInitialState: UpdatesState = {}

export interface AnUpdate {
  id: string
  text: string
}

const updatesSlice = createSlice({
  name: 'updates',
  initialState: updatesInitialState,
  reducers: {
    addUpdate(state, action: PayloadAction<AnUpdate>) {
      const id = action.payload.id
      const text = action.payload.text

      if (!state[id]) {
        state[id] = []
      }

      const date = `${Date.now()}`

      state[id].unshift(`[${date}]: ${text}`)
    },
  },
})

export const { addUpdate } = updatesSlice.actions

export default updatesSlice.reducer
