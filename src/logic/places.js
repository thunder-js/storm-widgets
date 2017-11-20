// const findByType = (addressComponents, type) => addressComponents.find(addressComponent => addressComponent.types.indexOf(type) !== -1)
// const getLongName = addressComponent => addressComponent && addressComponent.long_name
// const getShortName = addressComponent => addressComponent && addressComponent.short_name
// const getAddress = (addressComponents) => {
//   const streetName = getLongName(findByType(addressComponents, 'route'))
//   const streetNumber = getLongName(findByType(addressComponents, 'street_number'))
//   return `${streetName}${streetNumber ? `, ${streetNumber}` : ''}`
// }
// const getCity = addressComponents => getLongName(findByType(addressComponents, 'administrative_area_level_2'))
// const getState = addressComponents => getShortName(findByType(addressComponents, 'administrative_area_level_1'))
//
// export const getLocationFromReverseGeocodingPlace = place => ({
//   lat: place.geometry.location.lat,
//   lng: place.geometry.location.lng,
//   address: getAddress(place.address_components),
//   city: getCity(place.address_components),
//   state: getState(place.address_components),
// })

export const getLocationFromPlace = place => ({
  lat: place.latitude,
  lng: place.longitude,
  address: place.address,
  city: place.addressComponents.administrative_area_level_2,
  state: place.addressComponents.administrative_area_level_1,
})
