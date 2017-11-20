import React from 'react';
import { View, Alert, Platform } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import { getLatLng } from '@geolocation/lib'
import geocoder from 'react-native-geocoding';
import { func, string, shape, number } from 'prop-types'
import Text from '@components/Text'
import styled from 'styled-components/native'
import Button from '@widgets/Button'
import Loading from '@common/components/Loading'

const GEOCODING_API_KEY = 'AIzaSyDCJDhI43QchPtOt7GBWRHy-73rmJpDC8o'
geocoder.setApiKey(GEOCODING_API_KEY)

const getLocationFromPlace = place => ({
  lat: place.latitude,
  lng: place.longitude,
  address: place.name,
  city: place.addressComponents.administrative_area_level_2,
  state: place.addressComponents.administrative_area_level_1,
})


const findByType = (addressComponents, type) => addressComponents.find(addressComponent => addressComponent.types.indexOf(type) !== -1)
const getLongName = addressComponent => addressComponent && addressComponent.long_name
const getShortName = addressComponent => addressComponent && addressComponent.short_name
const getAddress = (addressComponents) => {
  const streetName = getLongName(findByType(addressComponents, 'route'))
  const streetNumber = getLongName(findByType(addressComponents, 'street_number'))
  return `${streetName}${streetNumber ? `, ${streetNumber}` : ''}`
}
const getCity = addressComponents => getLongName(findByType(addressComponents, 'administrative_area_level_2'))
const getState = addressComponents => getShortName(findByType(addressComponents, 'administrative_area_level_1'))

const getLocationFromReverseGeocodingPlace = place => ({
  lat: place.geometry.location.lat,
  lng: place.geometry.location.lng,
  address: getAddress(place.address_components),
  city: getCity(place.address_components),
  state: getState(place.address_components),
})

const ValueDisplay = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
`

const __ANDROID__ = Platform.OS === 'android'

const LoadingWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const getLocationFromCoords = async (lat, lng) => {
  const places = await geocoder.getFromLatLng(lat, lng)
  const results = places.results
  if (results && results.length) {
    const firstPlace = results[0]
    const location = getLocationFromReverseGeocodingPlace(firstPlace)
    return location
  }
  throw new Error('Erro obtendo localização')
}
export default class Places extends React.Component {
  state = {
    loading: false,
  }
  static defaultProps = {
    value: null,
  }

  static propTypes = {
    onChange: func.isRequired,
    value: shape({
      lat: number.isRequired,
      lng: number.isRequired,
      address: string.isRequired,
      city: string.isRequired,
      state: string.isRequired,
    }),
  }

  openSearchModal = async () => {
    const {
      onChange,
    } = this.props
    this.setState({
      loading: true,
    })
    try {
      const place = await RNGooglePlaces.openAutocompleteModal()
      let location
      if (__ANDROID__) {
        location = await getLocationFromCoords(place.latitude, place.longitude)
      } else {
        location = getLocationFromPlace(place)
      }

      if (onChange) { onChange(location) }
    } catch (err) {
      if (err.toString() === 'Error: Search cancelled') return
      Alert.alert('Erro', err.toString())
    }
    this.setState({
      loading: false,
    })
  }

  handleCurrentLocation = async () => {
    this.setState({
      loading: true,
    })
    const {
      onChange,
    } = this.props

    try {
      const coords = await getLatLng()
      const location = await getLocationFromCoords(coords.lat, coords.lng)
      if (onChange) { onChange(location) }
    } catch (err) {
      Alert.alert('Erro', err.toString())
    }

    this.setState({
      loading: false,
    })
  }

  getText = () => {
    const {
      value,
    } = this.props

    if (!value) {
      return 'Escolha uma das opções abaixo'
    }

    const {
      address,
      city,
      state,
    } = value
    return `${address} - ${city} - ${state}`
  }

  render() {
    const {
      value,
      ...props
    } = this.props
    return (
      <View {...props}>
        {this.state.loading
          ? (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          )
          : <ValueDisplay>{this.getText()}</ValueDisplay>}


        <Button
          primary
          mini
          title="Utilizar localização atual"
          onPress={this.handleCurrentLocation}
          style={{ marginBottom: 10 }}
        />
        <Button
          primary
          mini
          title="Procurar endereço"
          onPress={() => this.openSearchModal()}
        />
      </View>
    );
  }

}
