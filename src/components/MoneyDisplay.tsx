/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

interface Props {
  money: number
}

export const MoneyDisplay: React.FC<Props> = ({ money }) => {
  const [prevValue, setPrevValue] = useState<number>(money)

  const [changeBatch, setChangeBatch] = useState<number[]>([])

  useEffect(() => {
    const changeAmount = money - prevValue
    if (changeAmount === 0) return
    setChangeBatch((batch) => [...batch, changeAmount])
    const timer = setTimeout(() => {
      setPrevValue(money)
      setChangeBatch([])
    }, 2000)
    return () => clearTimeout(timer)
  }, [money])

  const changeSum = _.sum(changeBatch)

  return (
    <div className="flex flex-col justify-start items-start">
      <h4 className="text-lg text-yellow-600">{`${prevValue}$`}</h4>
      {changeBatch.length > 0 && (
        <h6 className={changeSum > 0 ? 'text-green-600' : 'text-red-600'}>{`${
          changeSum > 0 ? '+' : ''
        } ${_.sum(changeBatch)}$`}</h6>
      )}
    </div>
  )
}
