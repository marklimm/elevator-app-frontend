import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import {
  BuildingState,
  Elevator,
  ElevatorDirective,
} from 'lib/Elevator/Elevator'

import {
  NewConnectionBuildingResponse,
  NumPeopleUpdatedResponse,
} from 'lib/payloads/Building'

type UseSocketIOReturnType = BuildingState & {
  // elevators: null,
  // numFloors: number,
  sendMessage: (message: StatusMessage) => void
}

/**
 * This custom hook allows a react component to send and receive messages from the server-side socketIO instance
 * @param onStatusUpdateReceived
 * @returns
 */
export const useSocketIO = (socketIOUrl = ''): UseSocketIOReturnType => {
  const socket = useRef<Socket>(null)

  const [buildingName, setBuildingName] = useState('')

  const [numFloors, setNumFloors] = useState(0)
  const [numPeopleInBuilding, setNumPeopleInBuilding] = useState(0)
  // const [statusMessages, setStatusMessages] = useState<string[]>([])

  useEffect(() => {
    //  connect to the server-side socketIO
    socket.current = io(socketIOUrl)

    socket.current.on(
      'newConnectionAck',
      (response: NewConnectionBuildingResponse) => {
        //  client-side response to the server acknowledging the connection

        console.log('the server has recognized me!', response)
        // console.log('newConnectionAck : buildingState', buildingState)

        setBuildingName(response.name)
        setNumPeopleInBuilding(response.numPeople)
        setNumFloors(response.numFloors)

        // setElevators(buildingState.elevators)
        //  now connected to socket.io
      }
    )

    socket.current.on('status-update', (message: StatusMessage) => {
      //  client has received a status update from the server

      console.log('received status-update', message)

      setNumPeopleInBuilding(message.numPeopleInBuilding)
    })
  }, [])

  /**
   * This function sends a message from client to server
   * @param message The message to send to the socketio server
   */
  // const goToFloor = (elevatorDirective: ElevatorDirective) => {
  //   socket.current.emit('elevator-directive', elevatorDirective)
  // }

  const addPeople = () => {
    socket.current.emit(
      'increase-people',
      25,
      (response: NumPeopleUpdatedResponse) => {
        console.log('response to increase-people', response)

        setNumPeopleInBuilding(response.numPeople)
      }
    )
  }

  const removePeople = () => {
    socket.current.emit(
      'decrease-people',
      25,
      (response: NumPeopleUpdatedResponse) => {
        console.log('response to decrease-people', response)

        setNumPeopleInBuilding(response.numPeople)
      }
    )
  }

  return {
    addPeople,
    buildingName,
    // elevators,
    numFloors,
    numPeopleInBuilding,
    // goToFloor,
    removePeople,
  }
}
