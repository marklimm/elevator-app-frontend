import React, { FunctionComponent } from 'react'

import { useSocketIOServerConn } from 'lib/socketIO/useSocketIOServerConn'

import { ElevatorRow } from './ElevatorRow'
import { PeopleRowMemo } from './PeopleRow'
import { NewPersonForm } from './NewPersonForm/NewPersonForm'
import { usePlaceholderName } from './NewPersonForm/usePlaceholderName'

interface ElevatorAdminViewProps {
  socketIOUrl: string
}

export const ElevatorAdminView: FunctionComponent<ElevatorAdminViewProps> = ({
  socketIOUrl,
}: ElevatorAdminViewProps) => {
  //  setup the connection to the server-side socket io instance
  const {
    buildingName,
    elevatorUpdates,
    // goToFloor,
    // requestElevator,
    peopleUpdates,
    spawnNewPerson,
  } = useSocketIOServerConn(socketIOUrl)

  const { placeholderName } = usePlaceholderName(Object.keys(peopleUpdates))

  return (
    <>
      <div className='text-xl font-bold'>{buildingName}</div>
      {/* There are currently {numPeopleInBuilding} people in the building
      <br />
      <br />
      <button onClick={buttonClicked}>Send realtime message to server</button>
      The building has {numFloors} floors
      <br />
      <button onClick={addPeople}>Add people</button>
      <br />
      <button onClick={removePeople}>Remove people</button> */}
      <ElevatorRow elevatorUpdates={elevatorUpdates} />
      <PeopleRowMemo peopleUpdates={peopleUpdates} />

      <NewPersonForm
        onSpawnNewPerson={spawnNewPerson}
        placeholderName={placeholderName}
      />

      {/* {activeFloorRequest && (
        <span className='text-lg'>
          There is an active floor request to go to floor: {activeFloorRequest}
        </span>
      )} */}
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
