import React from 'react';
import { string, bool, func } from 'prop-types';
import { Image, View, Animated, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Panel from '../common/Panel'
import iconCheckmark from '../assets/icon-checkmark.png'

const StyledPanel = styled(Panel)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const StyledImage = styled(Image)`
  align-self: stretch;
  margin-bottom: 10px;
  flex: 1;
`;
const Label = styled(Text)`
  font-size: 16px;
  text-align: center;
`;
const CheckmarkContainer = styled(Animated.View)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  right: 0px;
`;
const Wrapper = styled(View)`
  flex: 1;
  padding: 8px;
`;

const CheckIcon = styled(Image)`
  width: 15px;
  height: 15px;
`

const Button = styled(TouchableOpacity)`
  padding: 10px;
  flex: 1;
  justify-content: center;
  align-self: stretch;
  align-items: center;
`
class SelectableCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scaleAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animateCheckmark(this.props.selected);
  }
  animateCheckmark(expanded) {
    Animated.timing(this.state.scaleAnimation, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.animateCheckmark(nextProps.selected);
    }
  }

  render() {
    const {
      imageSource,
      selected,
      label,
      onChange,
      color,
      style,
    } = this.props;

    const scale = this.state.scaleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.01, 1],
    });
    const rotate = this.state.scaleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '0deg'],
    });

    return (
      <Wrapper style={style}>
        <StyledPanel rounded noPadding>
          <Button onPress={() => onChange(!selected)} activeOpacity={0.8}>
            <StyledImage source={imageSource} resizeMode="contain" />
            <Label numberOfLines={1}>{label}</Label>
          </Button>
        </StyledPanel>
        <CheckmarkContainer
          color={color}
          style={{
            elevation: selected ? 5 : 0,
            transform: [
              { scale },
              { rotate },
            ],
          }}
        >
          <CheckIcon source={iconCheckmark} />
        </CheckmarkContainer>
      </Wrapper>
    );
  }
}


SelectableCard.propTypes = {
  imageSource: Image.propTypes.source,
  color: string.isRequired,
  onChange: func.isRequired,
  selected: bool,
  label: string,
  style: View.propTypes.style,
};

SelectableCard.defaultProps = {
  style: null,
  imageSource: null,
  selected: false,
  label: null,
  mini: false,
  medium: false,
  big: false,
};

export default SelectableCard;
