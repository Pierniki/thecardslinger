import _ from 'lodash'

export * from './wait'

export const generateDeviationTransform = () => {
  const rotation = _.random(-5, 5)

  return `rotate(${rotation}deg) `
}
