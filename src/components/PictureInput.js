import React from 'react';
import { string, func, bool, arrayOf, number } from 'prop-types';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import Gradient from 'storm-common/src/components/Gradient'
import styled from 'styled-components/native';
import AnimatedProgressBar from 'storm-common/src/components/AnimatedProgressBar'
import Panel from '../common/Panel'

const checkmarkImageSource = require('../assets/icon-checkmark.png');

const Wrapper = styled.View`
 width: 266px;
 align-self: center;
`
const StyledPanel = styled(Panel)`
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 239px;
  align-self: stretch;
`;
const StyledGradient = styled(Gradient)`
  height: 178px;
  align-items: center;
  justify-content: center;
`;
const PictureTarget = styled(Image)`
  width: 100px;
  height: 100px;
`;
const ChangePictureButton = styled(TouchableOpacity)`
  margin-top: 15px;
  height: 20px;
  align-self: flex-start;
`;
const ChangePictureText = styled(Text)`
  font-size: 15px;
  font-family: OpenSans-Semibold;
  color: ${props => props.color};
`;
const PreviewImage = styled(Image)`
  height: 178px;
`;

const ConfirmButton = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: -30px;
  right: 10px;
  elevation: 5;
`;

const ButtonImage = styled(Image)`
  width: 39px;
  height: 39px;
`;

const SuccessImageContainer = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #27ae60;
  align-items: center;
  justify-content: center;
`
const SuccessImage = styled(Image)`
  width: 20px;
  height: 20px;
  tint-color: #FFF;
`;

const Row = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ProgressWrapper = styled(View)`
  flex: 1;
`;


const PictureInput = ({
  imageUrl,
  selectImage,
  startUpload,
  uploading,
  success,
  placeholderImageSource,
  colors,
  progress,
  confirmButtonColor,
  changePictureColor,
}) => {
  const showChangePicture = !!imageUrl && !uploading;
  const showConfirm = (!!imageUrl && !uploading && !success);
  const showProgress = uploading;
  const showSuccess = success;

  return (
    <Wrapper >
      <StyledPanel noPadding>
        {
          imageUrl
          ? <PreviewImage source={{ uri: imageUrl }} resizeMode="cover" />
          : (
            <TouchableOpacity onPress={selectImage}>
              <StyledGradient colors={colors} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                <PictureTarget source={placeholderImageSource} resizeMode="contain" />
              </StyledGradient>
            </TouchableOpacity>
          )
        }
        <Row>
          {showChangePicture &&
            <ChangePictureButton onPress={selectImage}>
              <ChangePictureText color={changePictureColor}>TROCAR FOTO</ChangePictureText>
            </ChangePictureButton>
          }
          {showProgress &&
            <ProgressWrapper>
              <AnimatedProgressBar
                progress={progress}
              />
            </ProgressWrapper>
          }
          {showSuccess &&
            <SuccessImageContainer>
              <SuccessImage source={checkmarkImageSource} resizeMode="contain" />
            </SuccessImageContainer>
          }
        </Row>

      </StyledPanel>
      {showConfirm &&
        <ConfirmButton
          onPress={startUpload}
          color={confirmButtonColor}
        >
          <ButtonImage source={checkmarkImageSource} resizeMode="contain" />
        </ConfirmButton>
      }
    </Wrapper>

  );
};


PictureInput.propTypes = {
  imageUrl: string,
  uploading: bool.isRequired,
  success: bool.isRequired,
  colors: arrayOf(string).isRequired,
  placeholderImageSource: Image.propTypes.source.isRequired,
  selectImage: func.isRequired,
  startUpload: func.isRequired,
  progress: number,
  confirmButtonColor: string.isRequired,
  changePictureColor: string.isRequired,
};

PictureInput.defaultProps = {
  imageUrl: null,
  progress: 0,
};

export default PictureInput
