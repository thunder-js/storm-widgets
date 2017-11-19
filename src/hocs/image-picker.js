/* global alert */
import React, { Component } from 'react';
import { func } from 'prop-types'
import ImagePicker from 'react-native-image-picker';

const IMAGE_PICKER_OPTIONS = {
  title: 'Selecione uma foto',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  allowsEditing: true,
  quality: 0.5,
  maxWidth: 1440,
  maxHeight: 900,
  mediaType: 'photo',
  cameraType: 'front',
};

type ImagePickerResponse = {
  didCancel: boolean,
  error: any,
  customButton: number,
  uri: string,
  data: string,
  filename: string
}

export default ComposedComponent => class extends Component {
  state: {
    localUri: ?string,
    loadingImage: boolean,
  }

  static propTypes = {
    onImageSelect: func,
  }

  static defaultProps = {
    onImageSelect: null,
  }

  constructor(props: any) {
    super(props);
    this.state = {
      localUri: null,
      loadingImage: false,
    };

    this.pickImage = this.pickImage.bind(this);
  }

  pickImage() {
    const { onImageSelect, onChange } = this.props;

    this.setState({
      loadingImage: true,
    });
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response: ImagePickerResponse) => {
      if (response.didCancel) {

      } else if (response.error) {
        alert(`Erro: ${response.error}`);
      } else {
        if (onImageSelect) {
          onImageSelect();
        }

        this.setState({
          localUri: response.uri,
          loadingImage: false,
          data: response.data,
          fileName: response.fileName,
        });
      }
    });
  }

  render() {
    return (
      <ComposedComponent
        pickImage={this.pickImage}

        imageUrl={this.state.localUri}

        localUri={this.state.localUri}
        loadingImage={this.state.loadingImage}
        data={this.state.data}
        fileName={this.state.fileName}
        {...this.props}
      />
    );
  }

  };
