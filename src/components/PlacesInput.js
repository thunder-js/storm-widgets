import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import Button from 'storm-common/src/components/Button'
import Text from 'storm-common/src/components/Text'
import { func, shape, number, string, bool } from 'prop-types'

const LoadingWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const ValueDisplay = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
`

const getTextFromValue = (value) => {
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

class PlacesInput extends React.Component {
  static propTypes = {
    getCurrentLocation: func.isRequired,
    getArbitraryLocation: func.isRequired,
    loading: bool.isRequired,
    onChange: func.isRequired,
    value: shape({
      lat: number.isRequired,
      lng: number.isRequired,
      address: string.isRequired,
      city: string.isRequired,
      state: string.isRequired,
    }),
  }
  static defaultProps = {
    value: null,
  }
  handleGetCurrentLocation = async () => {
    const {
      getCurrentLocation,
      onChange,
    } = this.props
    const location = await getCurrentLocation()
    if (location) {
      onChange(location)
    }
  }
  handleGetArbitraryLocation = async () => {
    const {
      getArbitraryLocation,
      onChange,
    } = this.props
    const location = await getArbitraryLocation()
    if (location) {
      onChange(location)
    }
  }
  render() {
    const {
      value,
      loading,
      ...props
    } = this.props

    const loadingComponent = (
      <LoadingWrapper>
        <ActivityIndicator />
      </LoadingWrapper>
    )

    return (
      <View {...props}>
        {loading
          ? loadingComponent
          : <ValueDisplay>{getTextFromValue(value)}</ValueDisplay>}
        <Button
          primary
          mini
          title="Utilizar localização atual"
          onPress={this.handleGetCurrentLocation}
          style={{ marginBottom: 10 }}
        />
        <Button
          primary
          mini
          title="Procurar endereço"
          onPress={this.handleGetArbitraryLocation}
        />
      </View>
    )
  }
}


export default PlacesInput
