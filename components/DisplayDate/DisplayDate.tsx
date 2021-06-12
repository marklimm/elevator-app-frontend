import React, { FunctionComponent } from 'react'
import { parseISO, format } from 'date-fns'

interface DisplayDateProps {
  dateString: string
}

const DisplayDate: FunctionComponent<DisplayDateProps> = ({
  dateString,
}: DisplayDateProps) => {
  const date = parseISO(dateString)
  const formattedDate = format(date, 'LLLL d, yyyy')

  return <time dateTime={dateString}>{formattedDate}</time>
}

export default DisplayDate
