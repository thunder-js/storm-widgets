/*  global navigator */
import { PermissionsAndroid, Platform } from 'react-native';

const getCurrentPosition = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject);
});

const askGeolocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Permissão para geolocalização',
      message: 'O SaveBob precisa da sua localização para encontrar e cadastrar os Pets ' +
                'Por favor, autorize o uso do GPS do celular para melhorar sua experiência',
    },
  );

  return (granted || granted === PermissionsAndroid.RESULTS.GRANTED); // TODO
};

export const getLatLng = async () => {
  if (Platform.OS === 'android') {
    const granted = await askGeolocationPermission();
    if (!granted) {
      throw new Error('Não tem permissão para acessar GPS');
    }
  }

  const location = await getCurrentPosition();
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
};
