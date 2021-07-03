import { useEffect, useRef, useReducer, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { getDisplayFloorNumber } from 'lib/FloorNumberConverter'

import {
  NewConnectionBuildingResponse,
  // OkOrError,
  // REQUEST_ELEVATOR,
} from 'lib/BuildingActions'

import UpdatesReducer, {
  addUpdate,
  updatesInitialState,
} from './UpdatesReducer'

import {
  ElevatorUpdate,
  ElevatorUpdateType,
  PersonUpdate,
  PersonUpdateType,
} from 'lib/types/EventPayloads'

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
  const [numPeopleInBuilding, setNumPeopleInBuilding] = useState(0)

  const [statusStrings, setStatusStrings] = useState<string[]>([])

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
        setNumPeopleInBuilding(response.numPeople)
        setNumFloors(response.numFloors)

        //  now connected to socket.io
      }
    )

    // const onStatusUpdate = (data: StatusUpdateResponse) => {
    //   //  client has received a status update from the server

    //   console.log('status-update', data)
    //   setNumPeopleInBuilding(data.numPeople)

    //   // responseStrs.push(`There are currently ${numPeople} in the building`)

    //   const newStatusStrings = data.users.map((user) => {
    //     const { currFloor, destFloor, name, status } = user

    //     let statusString = ''
    //     switch (status) {
    //       case UserStatus.NEWLY_SPAWNED:
    //         statusString = `${name} has just appeared.  They are on the ${getDisplayFloorNumber(
    //           currFloor
    //         )} floor and want to get to the ${getDisplayFloorNumber(
    //           destFloor
    //         )} floor`
    //         break

    //       case UserStatus.WAITING_FOR_ELEVATOR:
    //         statusString = `${name} clicked the button.  They are now waiting for the elevator.  They are on the ${getDisplayFloorNumber(
    //           currFloor
    //         )} floor and want to get to the ${getDisplayFloorNumber(
    //           destFloor
    //         )} floor`

    //         break
    //     }

    //     return `${statusString}`
    //   })

    //   setStatusStrings((statusStrings) => {
    //     return [...newStatusStrings, ...statusStrings]
    //   })
    // }

    const onPersonUpdate = (personUpdate: PersonUpdate) => {
      const person = personUpdate.person

      switch (personUpdate.type) {
        case PersonUpdateType.NEWLY_SPAWNED:
          personDispatch(
            addUpdate({
              id: person.personId,
              text: `${
                person.name
              } has just appeared.  They are on the ${getDisplayFloorNumber(
                personUpdate.currFloor
              )} floor and is requesting the elevator`,
            })
          )

          break

          // case PersonUpdateType.REQUESTING_ELEVATOR:
          //   elevatorDispatch(
          //     addUpdate({
          //       id: person.personId,
          //       text: `${person.name} on the ${getDisplayFloorNumber(
          //         personUpdate.currFloor
          //       )} floor and is requesting the elevator`,
          //     })
          //   )

          break
      }
    }

    const onElevatorUpdate = (elevatorUpdate: ElevatorUpdate) => {
      const elevator = elevatorUpdate.elevator

      switch (elevatorUpdate.type) {
        case ElevatorUpdateType.OPENING_DOORS:
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${elevator.name} has reached its destination and is opening its doors on floor ${elevatorUpdate.currFloor}`,
            })
          )

          break

        case ElevatorUpdateType.MOVING_TO_FLOOR:
          elevatorDispatch(
            addUpdate({
              id: elevator.elevatorId,
              text: `${elevator.name} has moved to floor ${elevatorUpdate.currFloor}`,
            })
          )

          break
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

  // const addPeople = () => {
  //   socket.current.emit(
  //     'increase-people',
  //     25,
  //     (response: NumPeopleUpdatedResponse) => {
  //       console.log('response to increase-people', response)

  //       setNumPeopleInBuilding(response.numPeople)
  //     }
  //   )
  // }

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
    // activeFloorRequest,
    // addPeople,
    buildingName,
    elevatorUpdates,
    numFloors,
    numPeopleInBuilding,
    // goToFloor,
    // requestElevator,
    // removePeople,
    peopleUpdates,
  }
}
