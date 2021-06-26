import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { getDisplayFloorNumber } from 'lib/FloorNumberConverter'

import {
  Direction,
  // ElevatorRequestResponse,
  ElevatorStatus,
  ElevatorStatusUpdate,
  NewConnectionBuildingResponse,
  // NumPeopleUpdatedResponse,
  OkOrError,
  REQUEST_ELEVATOR,
  StatusUpdateResponse,
  UserStatus,
} from 'lib/BuildingActions'

// type UseSocketIOReturnType = BuildingState & {
//   // elevators: null,
//   // numFloors: number,
//   sendMessage: (message: StatusMessage) => void
// }

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

  const [elevatorStatusStrings, setElevatorStatusStrings] = useState<string[]>(
    []
  )
  const [statusStrings, setStatusStrings] = useState<string[]>([])

  const [activeFloorRequest, setActiveFloorRequest] = useState<number>()
  // const [statusMessages, setStatusMessages] = useState<string[]>([])

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

        // setElevators(response.elevators)

        // setElevators(buildingState.elevators)
        //  now connected to socket.io
      }
    )

    // socket.current.on(
    //   ELEVATOR_STATUS,
    //   (response: ElevatorTakingRequestResponse) => {
    //     response.message

    //     setNumPeopleInBuilding(message.numPeopleInBuilding)
    //   }
    // )

    const onElevatorUpdate = ({ elevator }: ElevatorStatusUpdate) => {
      if (elevator.status === ElevatorStatus.MOVING) {
        const newString = `${
          elevator.name
        } has moved to the ${getDisplayFloorNumber(
          elevator.currFloor
        )} floor and is moving ${
          elevator.direction === Direction.GOING_UP ? 'up' : 'down'
        } towards the ${getDisplayFloorNumber(elevator.destFloor)} floor`

        setElevatorStatusStrings((prevStrings) => {
          return [newString, ...prevStrings]
        })

        return
      } else if (elevator.status === ElevatorStatus.DOORS_OPENING) {
        const newString = `${
          elevator.name
        } is opening its doors on the ${getDisplayFloorNumber(
          elevator.currFloor
        )} floor`

        setElevatorStatusStrings((prevStrings) => {
          return [newString, ...prevStrings]
        })

        return
      }
    }

    const onStatusUpdate = (data: StatusUpdateResponse) => {
      //  client has received a status update from the server

      console.log('status-update', data)
      setNumPeopleInBuilding(data.numPeople)

      // responseStrs.push(`There are currently ${numPeople} in the building`)

      const newStatusStrings = data.users.map((user) => {
        const { currFloor, destFloor, name, status } = user

        let statusString = ''
        switch (status) {
          case UserStatus.NEWLY_SPAWNED:
            statusString = `${name} has just appeared.  They are on the ${getDisplayFloorNumber(
              currFloor
            )} floor and want to get to the ${getDisplayFloorNumber(
              destFloor
            )} floor`
            break

          case UserStatus.WAITING_ON_ELEVATOR:
            statusString = `${name} clicked the button.  They are now waiting on the elevator.  They are on the ${getDisplayFloorNumber(
              currFloor
            )} floor and want to get to the ${getDisplayFloorNumber(
              destFloor
            )} floor`

            break
        }

        return `${statusString}`
      })

      setStatusStrings((statusStrings) => {
        return [...newStatusStrings, ...statusStrings]
      })
    }

    socket.current.on('status-update', onStatusUpdate)
    socket.current.on('elevator-update', onElevatorUpdate)

    return () => {
      socket.current.off('status-update', onStatusUpdate)
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

  const requestElevator = () => {
    socket.current.emit(
      REQUEST_ELEVATOR,
      4,
      (response: ElevatorRequestResponse) => {
        console.log('response to elevator request', response)

        if (response.status === OkOrError.Error) {
          console.log(
            'oh no some error happened when trying to request the elevaotr!  Please try again later'
          )
          return
        }

        setActiveFloorRequest(response.destFloor)
      }
    )
  }

  return {
    activeFloorRequest,
    addPeople,
    buildingName,
    // elevators,
    elevatorStatusStrings,
    numFloors,
    numPeopleInBuilding,
    // goToFloor,
    requestElevator,
    removePeople,
    statusStrings,
  }
}
