/* global alert */
import React, { Component } from 'react';
import { func, string } from 'prop-types'
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid'

const FILE_ENDPOINT = 'https://api.graph.cool/file/v1/cj4fak8lvrawf0192i7eufvxo';
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

type ServerResponse = {
  url: string
}
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
    progress: number,
    error: boolean,
    success: boolean,
    uploading: boolean,
    errDescription: ?string,
    remoteUrl: ?string,
    localUri: ?string,
    loadingImage: boolean,
    uploadStarted: boolean
  }
  static defaultProps = {
    imageUrl: null,
    onUploadStart: null,
  }

  static propTypes = {
    onChange: func.isRequired,
    imageUrl: string,
    onImageSelect: func.isRequired,
    onUploadStart: func,
  }

  constructor(props: any) {
    super(props);
    this.state = {
      progress: 0,
      success: false,
      error: false,
      uploading: false,
      errDescription: null,
      localUri: null,
      remoteUrl: null,
      loadingImage: false,
    };

    this.getImage = this.getImage.bind(this);
    this.uploadWithRNFetchBlob = this.uploadWithRNFetchBlob.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.startUpload = this.startUpload.bind(this);
  }


  /**
   * Using RNFetchBlob for better performance
   * does not work for GraphCOOL
   * works for local node server
   */
  uploadWithRNFetchBlob(base64data: string, filename: string) {
    this.setInitialState();
    RNFetchBlob.fetch('POST', FILE_ENDPOINT, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    }, [{
      name: 'data',
      data: base64data,
      filename,
    }])
      .uploadProgress(this.updateProgress)
      .then((res) => {
        if (!res.json) { throw new Error('Could not process json'); }
        return res.json && res.json();
      })
      .then((data) => {
        this.setSuccessState(data);
        this.props.onChange(data.url);
      })
      .catch((err) => {
        alert(`Error: ${err.toString()}`);
        this.setErrorState(err);
      });
  }

  updateProgress(written: number, total: number) {
    this.setState({
      progress: total !== 0 ? written / total : 0,
    });
  }

  setInitialState() {
    this.setState({
      progress: 0,
      uploading: true,
      success: false,
      error: false,
      uploadStarted: true,
    });
  }

  setErrorState(err: any) {
    this.setState({
      uploading: false,
      error: true,
      errDescription: err.toString(),
    });
  }

  setSuccessState(data: ServerResponse) {
    this.setState({
      uploading: false,
      progress: 1,
      success: true,
      remoteUrl: data.url,
    });
  }

  startUpload() {
    const { onUploadStart } = this.props;
    const { data, fileName } = this.state;
    if (data) {
      if (onUploadStart) {
        onUploadStart();
      }
      this.uploadWithRNFetchBlob(data, fileName || uuid.v4());
    }
  }

  getImage() {
    const { onImageSelect, onChange } = this.props;

    this.setState({
      loadingImage: true,
    });
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response: ImagePickerResponse) => {
      if (response.didCancel) {

      } else if (response.error) {
        alert(`Erro: ${response.error}`);
      } else {
        onChange(null);
        if (onImageSelect) {
          onImageSelect();
        }

        this.setState({
          success: false,
          error: false,
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
        imageUrl={this.state.localUri ? this.state.localUri : this.props.imageUrl}
        selectImage={this.getImage}
        startUpload={this.startUpload}
        uploadStarted={this.state.uploadStarted}
        progress={this.state.progress}
        loadingImage={this.state.loadingImage}
        uploading={this.state.uploading}
        success={this.state.success}
        error={this.state.error}
      />
    );
  }

  };
