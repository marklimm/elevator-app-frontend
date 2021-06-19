import React, { FunctionComponent } from 'react'

import { useSocketIO } from 'lib/socketIO/useSocketIO'

interface BuildingProps {
  socketIOUrl: string
}

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}

export const Building: FunctionComponent<BuildingProps> = ({
  socketIOUrl,
}: BuildingProps) => {
  //  setup the connection to the server-side socket io instance
  const {
    addPeople,
    // elevators,
    numFloors,
    numPeopleInBuilding,
    // goToFloor,
    removePeople,
  } = useSocketIO(socketIOUrl)

  console.log('app render')

  // const buttonPressed = (elevatorName = '', destFloor = 1) => {
  //   console.log('floorClicked : destFloor', destFloor)

  //   goToFloor({
  //     name: elevatorName,
  //     destFloor,
  //   })
  // }

  // const elevatorsArr = Object.keys(elevators).map((key) => elevators[key])

  // const elevatorButtons = range(1, 5)

  return (
    <>
      <div className='text-xl font-bold'>{`Placeholder for name of building`}</div>
      There are currently {numPeopleInBuilding} people in the building
      <br />
      <br />
      {/* <button onClick={buttonClicked}>Send realtime message to server</button> */}
      The building has {numFloors} floors
      <br />
      <button onClick={addPeople}>Add people</button>
      <br />
      <button onClick={removePeople}>Remove people</button>
      <br />
      {/* <div className='flex'>
        {elevatorsArr.map((elevator, index) => (
          <div key={index} className='m-5' style={{ minWidth: '400px' }}>
            <div className='font-bold'>{elevator.name}</div>
            <div className='flex'>
              {elevatorButtons.map((number, index) => (
                <button
                  key={index}
                  className='m-3 p-3 font-bold'
                  onClick={buttonPressed.bind(this, elevator.name, number)}
                >
                  {number}
                </button>
              ))}
            </div>
            Current Floor: {elevator.currFloor}
            <div className='mt-5'>
              {elevator.messages.length === 0 && (
                <div>No status messages received yet</div>
              )}
              {elevator.messages.length > 0 &&
                elevator.messages.map((message, index) => (
                  <div key={index}>{message.text}</div>
                ))}
            </div>
          </div>
        ))}
      </div> */}
    </>
  )
}

export default Building
