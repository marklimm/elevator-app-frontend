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
  ElevatorStatus,
  ElevatorUpdate,
  NewConnectionBuildingResponse,
  PersonUpdate,
  PersonStatus,
} from 'lib/types/EventPayloads'

interface UseSocketIOReturnType {
  buildingName: string
  elevatorUpdates: UpdatesState
  numFloors: number
  peopleUpdates: UpdatesState
  spawnNewPerson: () => void
}

/**
 * This custom hook allows a react component to send and receive messages from the server-side socketIO instance
 * @param onStatusUpdateReceived
 * @returns
 */
export const useSocketIO = (socketIOUrl = ''): UseSocketIOReturnType => {
  const socket = useRef<Socket>(null)

  const [buildingName, setBuildingName] = useState('')
  // const [elevators, setElevators] = useState<string>([])

  const [numFloors, setNumFloors] = useState(0)
  // const [numPeopleInBuilding, setNumPeopleInBuilding] = useState(0)

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

        console.log('the server has recognized me!', response)
        // console.log('newConnectionAck : buildingState', buildingState)

        setBuildingName(response.name)
        setNumFloors(response.numFloors)

        //  now connected to socket.io
      }
    )

    const onPersonUpdate = (personUpdate: PersonUpdate) => {
      const person = personUpdate.person

      switch (personUpdate.type) {
        case PersonStatus.NEWLY_SPAWNED:
          personDispatch(
            addUpdate({
              id: person.personId,
              text: `${
                person.name
              } has just appeared.  They are on the ${getDisplayFloorNumber(
                personUpdate.currFloor
              )} floor`,
            })
          )

          break

        case PersonStatus.REQUESTED_ELEVATOR:
          personDispatch(
            addUpdate({
              id: person.personId,
              text: `${person.name} on the ${getDisplayFloorNumber(
                personUpdate.currFloor
              )} floor has requested the elevator.  (They want to get to the ${getDisplayFloorNumber(
                personUpdate.destFloor
              )} floor)`,
            })
          )

          break
      }
    }

    const onElevatorUpdate = (elevatorUpdate: ElevatorUpdate) => {
      const elevator = elevatorUpdate.elevator

      console.log('receiving elevator update', elevatorUpdate.type)

      switch (elevatorUpdate.type) {
        case ElevatorStatus.READY: {
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${elevator.name} is ready on the ${getDisplayFloorNumber(
                elevatorUpdate.currFloor
              )} floor and waiting to take a request `,
            })
          )

          break
        }

        case ElevatorStatus.TOOK_REQUEST: {
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${
                elevator.name
              } is taking the request to go to the ${getDisplayFloorNumber(
                elevatorUpdate.destFloor
              )} floor`,
            })
          )

          break
        }

        case ElevatorStatus.DOORS_OPENING: {
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${elevator.name} has reached its destination and is opening its doors on floor ${elevatorUpdate.currFloor}`,
            })
          )

          break
        }

        case ElevatorStatus.RECEIVED_DESTINATION: {
          const personWhoGaveDestination =
            elevatorUpdate.people[elevatorUpdate.people.length - 1]

          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${personWhoGaveDestination.name} got into ${
                elevator.name
              } and pressed the button to go to the ${getDisplayFloorNumber(
                elevatorUpdate.destFloor
              )} floor`,
            })
          )

          break
        }

        case ElevatorStatus.MOVING_TO_FLOOR: {
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${elevator.name} has moved to floor ${elevatorUpdate.currFloor}`,
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
  const spawnNewPerson = (newPersonName = 'John Doe') => {
    event.preventDefault()

    socket.current.emit(
      ClientCommands.SPAWN_NEW_PERSON,
      newPersonName,
      (response: PersonUpdate) => {
        console.log('server response to spawnnewperson', response)
      }
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
    buildingName,
    elevatorUpdates,
    numFloors,
    peopleUpdates,
    spawnNewPerson,
  }
}
