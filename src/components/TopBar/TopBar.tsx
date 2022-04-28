import React from 'react'
import { useAppSelector } from 'state'
import { MoneyDisplay } from './MoneyDisplay'

interface Props {}

const topBarPath = `${process.env.PUBLIC_URL}/assets/top-bar`

export const TopBar: React.FC<Props> = () => {
  const money = useAppSelector((state) => state.player.money)

  return (
    <div className="w-full flex justify-center overflow-hidden h-[80px]">
      <div
        className="min-w-[60px] mb-ext:block hidden bg-right bg-no-repeat bg-cover h-[80px]"
        style={{
          backgroundImage: `url(${topBarPath}/corner-left.png)`,
          backgroundSize: 'auto 100%',
        }}
      />
      <div
        className="w-full mb-ext:block hidden bg-right bg-cover h-[56px]"
        style={{
          backgroundImage: `url(${topBarPath}/tile-top-left.png)`,
          backgroundSize: 'auto 100%',
        }}
      />
      <div
        className="mb-ext:min-w-[450px] max-w-[450px] w-full h-[60px] flex justify-between items-start gap-8 px-5 pb-[18px] pt-[14px]  relative bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${topBarPath}/top-bg2.png)`,
          backgroundSize: '100% 100%',
        }}
      >
        <div className="w-full absolute h-10 left-0 right-0 bg-gray-600 z-[-1] opacity-20 blur-sm -bottom-1" />
        <MoneyDisplay money={money} />
      </div>
      <div
        className="w-full mb-ext:block hidden bg-right  bg-cover h-[56px]"
        style={{
          backgroundImage: `url(${topBarPath}/tile-top-right.png)`,
          backgroundSize: 'auto 100%',
        }}
      />
      <div
        className="min-w-[60px] mb-ext:block hidden bg-left bg-no-repeat bg-cover  h-[80px]"
        style={{
          backgroundImage: `url(${topBarPath}/corner-right.png)`,
          backgroundSize: 'auto 100%',
        }}
      />
    </div>
  )
}
