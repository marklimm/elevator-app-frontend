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
    elevatorUpdates,
    // goToFloor,
    // requestElevator,
    peopleUpdates,
    spawnNewPerson,
  } = useSocketIOServerConn(socketIOUrl)

  const { placeholderName } = usePlaceholderName(Object.keys(peopleUpdates))

  return (
    <>
      <div className='text-xl font-bold'>Building elevator simulator</div>
      <div className=''>
        <div className=''>
          This app simulates 2 elevators moving to different floors within an
          apartment building.
        </div>

        <div className='flex mt-5'>
          <div className='w-1/2'>
            <span className='text-lg'>People can:</span>
            <ul className='list-decimal ml-5'>
              <li>Spawn into existence</li>
              <li>Request an elevator</li>
              <li>Get into an elevator</li>
              <li>Push the button once they are in the elevator</li>
            </ul>
          </div>
          <div className='w-1/2'>
            <span className='text-lg'>Elevators can:</span>
            <ul className='list-decimal ml-5'>
              <li>Take requests to pick up people</li>
              <li>Open doors when they reach their destination</li>
              <li>
                Close doors when the person has pressed a button for what floor
              </li>
              <li>Move between floors</li>
            </ul>
          </div>
        </div>
      </div>

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
