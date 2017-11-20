import React from 'react'
import { Platform } from 'react-native'
import RNGooglePlaces from 'react-native-google-places';
import { getLocationFromPlace } from '../logic/places'

const __ANDROID__ = Platform.OS === 'android'

export default WrappedComponent => class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }
  setLoading = loading => this.setState({ loading })

  getCurrentLocation = async () => {
    this.setLoading(true)
    const placesCandidates = await RNGooglePlaces.getCurrentPlace()
    const currentPlace = placesCandidates[0]
    const location = getLocationFromPlace(currentPlace)
    this.setLoading(false)
    return location
  }
  getArbitraryLocation = async () => {
    this.setLoading(true)
    try {
      const place = await RNGooglePlaces.openAutocompleteModal()
      let location
      if (__ANDROID__) {
        //  FIXME!
        location = {}
      } else {
        location = getLocationFromPlace(place)
      }
      this.setLoading(false)
      return location
    } catch (err) {
      this.setLoading(false)
      if (err.toString() === 'Error: Search cancelled') return null
      throw err
    }
  }

  render() {
    const {
      ...props
    } = this.props
    return (
      <WrappedComponent
        loading={this.state.loading}
        getCurrentLocation={this.getCurrentLocation}
        getArbitraryLocation={this.getArbitraryLocation}
        {...props}
      />
    )
  }
}
