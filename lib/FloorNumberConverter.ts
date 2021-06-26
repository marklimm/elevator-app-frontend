export const getDisplayFloorNumber = (floorNumber = 0): string => {
  if (floorNumber === 1) {
    return `${floorNumber}st`
  }
  if (floorNumber === 2) {
    return `${floorNumber}nd`
  }
  if (floorNumber === 3) {
    return `${floorNumber}rd`
  }

  return `${floorNumber}th`
}
