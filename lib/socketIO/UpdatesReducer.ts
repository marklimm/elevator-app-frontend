import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'

/**
 *
 */
export interface UpdatesState {
  [key: string]: string[]
}

export const initialState: UpdatesState = {}

export interface AnUpdate {
  id: string
  text: string
}

const updatesSlice = createSlice({
  name: 'updates',
  initialState,
  reducers: {
    addUpdate(state, action: PayloadAction<AnUpdate>) {
      const id = action.payload.id
      const text = action.payload.text

      if (!state[id]) {
        state[id] = []
      }

      state[id].unshift(text)

      console.log('after a message has been added: state[id]', state[id])
    },
  },
})

export const { addUpdate } = updatesSlice.actions

export default updatesSlice.reducer
