//  @flow
import React from 'react'
import RNFetchBlob from 'react-native-fetch-blob';
import uuid from 'uuid'
import { func } from 'prop-types'

type ServerResponse = {
  url: string
}

export default ({ endpoint }) => ComposedComponent => class extends React.Component {
  static defaultProps = {
    onUploadStart: null,
    onUploadSuccess: null,
    onUploadError: null,
    onChange: null,
  }
  static propTypes = {
    onUploadStart: func,
    onUploadSuccess: func,
    onUploadError: func,
    onChange: func,
  }
  state: {
    uploading: boolean,
    progress: number,
    uploadError: ?any,
    uploadSuccess: ?any,
  }

  initialState = {
    uploading: false,
    progress: 0,
    uploadSuccess: false,
    uploadError: null,
  }

  constructor(props: any) {
    super(props);
    this.state = this.initialState
  }


  setInitialState = () => {
    this.setState(this.initialState);
  }

  setErrorState = (err: any) => {
    this.setState({
      uploading: false,
      uploadError: err,
      uploadSuccess: false,
    });
  }

  setSuccessState(serverResponse: ServerResponse) {
    this.setState({
      uploading: false,
      progress: 1,
      uploadSuccess: true,
      uploadError: null,
      remoteUrl: serverResponse.url,
    });
  }

  updateProgress = (written: number, total: number) => {
    this.setState({
      progress: total !== 0 ? written / total : 0,
    });
  }

  callIfExists = (fn, ...args) => {
    if (typeof fn === 'function') {
      fn(...args)
    }
  }
  startUpload = (data: string, fileName: string) => {
    if (!data) return
    if (this.props.onUploadStart) {
      this.props.onUploadStart();
    }

    this.setState({
      uploading: true,
      progress: 0,
    })
    RNFetchBlob.fetch('POST', endpoint, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    }, [{
      name: 'data',
      filename: fileName || uuid.v4(),
      data,
    }])
      .uploadProgress(this.updateProgress)
      .then((res) => {
        if (!res.json) { throw new Error('Could not process json'); }
        return res.json && res.json();
      })
      .then((serverResponse) => {
        this.callIfExists(this.props.onUploadSuccess, serverResponse)
        this.callIfExists(this.props.onChange, data.url)
        this.setSuccessState(serverResponse);
      })
      .catch((err) => {
        this.callIfExists(this.props.onUploadError, err)
        this.setErrorState(err);
      });
  }


  render() {
    return (
      <ComposedComponent
        startUpload={this.startUpload}
        progress={this.state.progress}
        uploading={this.state.uploading}
        uploadError={this.state.uploadError}
        uploadSuccess={this.state.uploadSuccess}
        {...this.props}
      />
    )
  }
}
