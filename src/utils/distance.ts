const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100m

type CoordinateType = {
  latitude: number
  longitude: number
}

type GetDistanceBetweenCoordinatesParams = {
  from: CoordinateType
  to: CoordinateType
}

/**
 * Calcula a distância entre duas coordenadas geográficas utilizando a fórmula de Haversine
 *
 * @param {GetDistanceBetweenCoordinatesParams} params - Objeto contendo as coordenadas de origem e destino
 * @param {CoordinateType} params.from - Coordenadas do ponto de origem
 * @param {CoordinateType} params.to - Coordenadas do ponto de destino
 *
 * @returns {number} Distância entre os pontos em quilômetros
 *
 * @example
 * // Retorna a distância em km entre dois pontos
 * const distance = getDistanceBetweenCoordinates({
 *   from: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
 *   to: { latitude: -22.9068, longitude: -43.1729 }    // Rio de Janeiro
 * });
 */
function getDistanceBetweenCoordinates({
  from,
  to,
}: GetDistanceBetweenCoordinatesParams) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  return dist
}

export { getDistanceBetweenCoordinates, MAX_DISTANCE_IN_KILOMETERS }
