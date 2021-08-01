import { useEffect, useState } from 'react'

/**
 * Generates a random name from an array of names.  The selected name will not be one of the names in `usedNames`
 * @param usedNames
 * @returns
 */
const getRandomName = (usedNames: string[] = []): string => {
  const names = [
    'Ash',
    'Brett',
    'Dallas',
    'Kane',
    'Lambert',
    'Parker',
    'Ripley',
  ]

  //  only choose names that aren't in the `usedNames` list
  let selectedName = ''
  do {
    selectedName = names[Math.floor(Math.random() * names.length)]
  } while (usedNames.indexOf(selectedName) > -1)

  return selectedName
}

/**
 * This function taken from https://stackoverflow.com/a/16436975
 * @param a
 * @param b
 * @returns
 */
const arraysAreEqual = (a, b) => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

interface UsePlaceholderNameReturnType {
  placeholderName: string
}

export const usePlaceholderName = (
  currUsedNames: string[]
): UsePlaceholderNameReturnType => {
  //  this custom hook re-renders each time ... I don't know if there's a way to not have that happen in the context of this being called from ElevatorAdminView.tsx

  // console.log(
  //   'usePlaceholderName re-render executing with : currUsedNames',
  //   currUsedNames
  // )

  const [placeholderName, setPlaceholderName] = useState<string>('')
  const [usedNames, setUsedNames] = useState<string[]>([])

  useEffect(() => {
    if (!arraysAreEqual(currUsedNames, usedNames)) {
      //  there's been a change in the currently used names, so update the list of used names and update the placeholder name

      setUsedNames(currUsedNames)

      setPlaceholderName(getRandomName(currUsedNames))
    }

    //  give the placeholderName an initial value
    if (placeholderName === '') {
      setPlaceholderName(getRandomName())
    }
  }, [currUsedNames])

  return {
    placeholderName,
  }
}
