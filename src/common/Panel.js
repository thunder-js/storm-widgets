import React from 'react';
import { node, bool } from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { getShadowProps } from '../common/logic/shadow';

const getBorderRadius = ({ rounded, smallBorderRadius }) => {
  if (rounded) {
    if (smallBorderRadius) return 10;
    return 18;
  }
  return 0;
};

const Wrapper = styled(View)`
  background-color: #FFF;
  padding: ${props => props.noPadding ? 0 : 15}px;
  border-radius: ${getBorderRadius}px;
  elevation: 4;
`;

const Panel = ({
  children,
  rounded,
  noPadding,
  style,
  ...props
}) => (
  <Wrapper
    rounded={rounded}
    style={[getShadowProps(1), style]}
    noPadding={noPadding}
    {...props}
  >
    {children}
  </Wrapper>
);

Panel.propTypes = {
  children: node.isRequired,
  rounded: bool,
  noPadding: bool,
  style: View.propTypes.style,
};

Panel.defaultProps = {
  rounded: false,
  noPadding: false,
  style: null,
};

export default Panel;
