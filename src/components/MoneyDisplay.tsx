/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

interface Props {
  money: number
}

export const MoneyDisplay: React.FC<Props> = ({ money }) => {
  const [prevValue, setPrevValue] = useState<number>(money)

  const changeAmount = money - prevValue

  useEffect(() => {
    if (changeAmount === 0) return
    const timer = setTimeout(() => {
      setPrevValue(money)
    }, 2000)
    return () => clearTimeout(timer)
  }, [money])

  return (
    <div className="flex flex-col justify-start items-start">
      <h4 className="text-lg text-yellow-600">{`${prevValue}$`}</h4>
      {changeAmount !== 0 && (
        <h6
          className={changeAmount > 0 ? 'text-green-600' : 'text-red-600'}
        >{`${changeAmount > 0 ? '+' : ''} ${changeAmount}$`}</h6>
      )}
    </div>
  )
}
