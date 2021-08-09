import { useEffect, useRef, useReducer, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { getDisplayFloorNumber } from 'lib/FloorNumberConverter'

import UpdatesReducer, {
  addUpdate,
  updatesInitialState,
  UpdatesState,
} from './UpdatesReducer'

import {
  ClientCommands,
  Direction,
  ElevatorStatus,
  ElevatorUpdateResponse,
  NewConnectionBuildingResponse,
  OkOrError,
  PersonStatus,
  PersonUpdateResponse,
} from 'lib/types/ElevatorAppTypes'

interface UseSocketIOServerConnReturnType {
  elevatorUpdates: UpdatesState
  numFloors: number
  peopleUpdates: UpdatesState
  spawnNewPerson: (
    string,
    onResponse: (personUpdateResponse: PersonUpdateResponse) => void
  ) => void
}

/**
 * This custom hook allows a react component to send and receive messages from the server-side socketIO instance
 * @param onStatusUpdateReceived
 * @returns
 */
export const useSocketIOServerConn = (
  socketIOUrl = ''
): UseSocketIOServerConnReturnType => {
  const socket = useRef<Socket>(null)

  const [numFloors, setNumFloors] = useState(0)

  const [elevatorUpdates, elevatorDispatch] = useReducer(
    UpdatesReducer,
    updatesInitialState
  )
  const [peopleUpdates, personDispatch] = useReducer(
    UpdatesReducer,
    updatesInitialState
  )

  // const [activeFloorRequest, setActiveFloorRequest] = useState<number>()

  useEffect(() => {
    //  connect to the server-side socketIO
    socket.current = io(socketIOUrl)

    socket.current.once(
      'newConnectionAck',
      (response: NewConnectionBuildingResponse) => {
        //  client-side response to the server acknowledging the connection

        const { building } = response

        // console.log('the server has recognized me!', response)
        // console.log('newConnectionAck : buildingState', buildingState)

        setNumFloors(building.numFloors)

        //  now connected to socket.io
      }
    )

    const onPersonUpdate = (personUpdateResponse: PersonUpdateResponse) => {
      if (
        personUpdateResponse.error ||
        personUpdateResponse.status === OkOrError.Error
      ) {
        console.error(
          `An error was returned from the server: ${personUpdateResponse.error}`
        )
        return
      }

      const personUpdate = personUpdateResponse.personUpdate

      const { elevator, person } = personUpdate

      switch (personUpdate.type) {
        case PersonStatus.NEWLY_SPAWNED:
          personDispatch(
            addUpdate({
              id: person.name,
              text: `${
                person.name
              } has just appeared.  They are on the ${getDisplayFloorNumber(
                person.currFloor
              )} floor`,
            })
          )

          break

        case PersonStatus.REQUESTED_ELEVATOR:
          personDispatch(
            addUpdate({
              id: person.name,
              text: `${person.name} on the ${getDisplayFloorNumber(
                person.currFloor
              )} floor has requested the elevator.  (They want to get to the ${getDisplayFloorNumber(
                person.destFloor
              )} floor)`,
            })
          )

          break

        case PersonStatus.ENTERED_THE_ELEVATOR:
          personDispatch(
            addUpdate({
              id: person.name,
              text: `${person.name} has entered ${
                elevator.name
              } on the ${getDisplayFloorNumber(
                person.currFloor
              )} floor.  (They want to get to the ${getDisplayFloorNumber(
                person.destFloor
              )} floor)`,
            })
          )

          break

        case PersonStatus.PRESSED_BUTTON:
          personDispatch(
            addUpdate({
              id: person.name,
              text: `${person.name} pressed the button in ${
                elevator.name
              } to go to the ${getDisplayFloorNumber(person.destFloor)} floor`,
            })
          )

          break
      }
    }

    const onElevatorUpdate = (
      elevatorUpdateResponse: ElevatorUpdateResponse
    ) => {
      if (
        elevatorUpdateResponse.error ||
        elevatorUpdateResponse.status === OkOrError.Error
      ) {
        console.error(
          `An error was returned from the server: ${elevatorUpdateResponse.error}`
        )
        return
      }

      const { type, elevator, people } = elevatorUpdateResponse.elevatorUpdate

      // console.log('receiving elevator update', type)

      switch (type) {
        case ElevatorStatus.READY: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${elevator.name} is ready on the ${getDisplayFloorNumber(
                elevator.currFloor
              )} floor and waiting to take a request `,
            })
          )

          break
        }

        case ElevatorStatus.TOOK_REQUEST: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${
                elevator.name
              } is taking the request to go to the ${getDisplayFloorNumber(
                elevator.destFloor
              )} floor`,
            })
          )

          break
        }

        case ElevatorStatus.DOORS_OPENING: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${
                elevator.name
              } has reached its destination and is opening its doors on the ${getDisplayFloorNumber(
                elevator.currFloor
              )} floor.  The elevator is going ${elevator.direction}`,
            })
          )

          break
        }

        case ElevatorStatus.DOORS_OPEN: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${
                elevator.name
              } has opened its doors on the ${getDisplayFloorNumber(
                elevator.currFloor
              )} floor.  The elevator is going ${elevator.direction}`,
            })
          )

          break
        }

        case ElevatorStatus.RECEIVED_DESTINATION: {
          const personWhoGaveDestination = people[people.length - 1]

          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${elevator.name} received the request from ${
                personWhoGaveDestination.name
              } to go to the ${getDisplayFloorNumber(
                elevator.destFloor
              )} floor`,
            })
          )

          break
        }

        case ElevatorStatus.DOORS_CLOSING: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${elevator.name} is closing its doors`,
            })
          )

          break
        }

        case ElevatorStatus.DOORS_CLOSED: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${elevator.name} has closed its doors and is heading ${
                elevator.direction
              } to the ${getDisplayFloorNumber(elevator.destFloor)} floor`,
            })
          )

          break
        }

        case ElevatorStatus.MOVING_TO_FLOOR: {
          elevatorDispatch(
            addUpdate({
              id: elevator.name,
              text: `${elevator.name} has ${
                elevator.direction === Direction.NONE
                  ? 'reached '
                  : `moved ${elevator.direction} to `
              } the ${getDisplayFloorNumber(elevator.currFloor)} floor`,
            })
          )

          break
        }
      }
    }

    socket.current.on('person-update', onPersonUpdate)
    socket.current.on('elevator-update', onElevatorUpdate)

    return () => {
      socket.current.off('person-update', onPersonUpdate)
      socket.current.off('elevator-update', onElevatorUpdate)
    }
  }, [])

  /**
   * This function sends a message from client to server
   * @param message The message to send to the socketio server
   */
  // const goToFloor = (elevatorDirective: ElevatorDirective) => {
  //   socket.current.emit('elevator-directive', elevatorDirective)
  // }

  /**
   * Send a web socket message to the server to spawn a new person
   * @param newPersonName
   */
  const spawnNewPerson = (
    newPersonName = 'John Doe',
    onResponse: (personUpdateResponse: PersonUpdateResponse) => void
  ) => {
    event.preventDefault()

    socket.current.emit(
      ClientCommands.SPAWN_NEW_PERSON,
      newPersonName,
      onResponse
    )
  }

  // const removePeople = () => {
  //   socket.current.emit(
  //     'decrease-people',
  //     25,
  //     (response: NumPeopleUpdatedResponse) => {
  //       console.log('response to decrease-people', response)

  //       setNumPeopleInBuilding(response.numPeople)
  //     }
  //   )
  // }

  // const requestElevator = () => {
  //   socket.current.emit(
  //     REQUEST_ELEVATOR,
  //     4,
  //     (response: ElevatorRequestResponse) => {
  //       console.log('response to elevator request', response)

  //       if (response.status === OkOrError.Error) {
  //         console.log(
  //           'oh no some error happened when trying to request the elevaotr!  Please try again later'
  //         )
  //         return
  //       }

  //       setActiveFloorRequest(response.destFloor)
  //     }
  //   )
  // }

  return {
    elevatorUpdates,
    numFloors,
    peopleUpdates,
    spawnNewPerson,
  }
}
