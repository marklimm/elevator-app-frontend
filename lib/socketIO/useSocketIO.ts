import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

/**
 * A message that is sent between client and server via socketio
 */
export interface StatusMessage {
  text: string
}

/**
 * A callback function that updates the react component when a socketio message is received from the server to the client
 */
export interface OnStatusUpdateReceived {
  (message: StatusMessage): void
}

interface UseSocketIOReturnType {
  sendMessage: (message: StatusMessage) => void
}

/**
 * This custom hook allows a react component to send and receive messages from the server-side socketIO instance
 * @param onStatusUpdateReceived
 * @returns
 */
export const useSocketIO = (
  socketIOUrl = '',
  onStatusUpdateReceived: OnStatusUpdateReceived
): UseSocketIOReturnType => {
  const socket = useRef<Socket>(null)

  useEffect(() => {
    //  connect to the server-side socketIO
    socket.current = io(socketIOUrl)

    // socket.on('connectionAck', (arg) => {
    //   //  client-side response to the server acknowledging the connection

    //   console.log(arg)

    //   //  now connected to socket.io
    // })

    socket.current.on('status-update', (message: StatusMessage) => {
      //  client has received a status update from the server

      console.log('received status-update', message.text)

      onStatusUpdateReceived(message)
    })
  }, [])

  /**
   * This function sends a message from client to server
   * @param message The message to send to the socketio server
   */
  const sendMessage = (message: StatusMessage) => {
    socket.current.emit('client-message', message)
  }

  return {
    sendMessage,
  }
}
