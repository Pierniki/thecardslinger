import _ from 'lodash'

export * from './wait'

export const generateDeviationTransform = () => {
  const rotation = _.random(-5, 5)
  const bottom = _.random(-2, 2)

  return `rotate(${rotation}deg) translate(0px, ${bottom}px)`
}
