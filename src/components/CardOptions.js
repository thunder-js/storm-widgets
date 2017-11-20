import React from 'react';
import { arrayOf, shape, string, bool, func, number } from 'prop-types';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import chunkenize from 'lodash/chunk';
import SelectableCard from './SelectableCard';

const Wrapper = styled(View)`
  flex: 1;
  flex-direction: column;
`;
const RowWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;

const CardWrapper = styled(View)`
  flex: 1;
`;


class CardOptions extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(option, newValue) {
    if (newValue) {
      this.props.onChange(option.value);
    } else if (this.props.nullable) {
      this.props.onChange(null);
    }
  }

  _getIndex = (i, j) => {
    const { itemsPerLine } = this.props
    return (i * itemsPerLine) + j
  }
  _getIsLastLine = (index) => {
    const { options, itemsPerLine } = this.props
    return index >= options.length - (options.length % itemsPerLine)
  }

  _getColumnFraction = () => {
    const { itemsPerLine } = this.props
    return 1 / itemsPerLine
  }

  _getMaxWidthForPosition = (i, j) => this._getIsLastLine(this._getIndex(i, j)) ? `${this._getColumnFraction() * 100}%` : undefined

  render() {
    const {
      options,
      itemsPerLine,
      value,
      onChange,
      cardColor,
      cardStyle,
      style,
      ...props
    } = this.props;
    const chunks = chunkenize(options, itemsPerLine);
    return (
      <Wrapper
        style={style}
        {...props}
      >
        {chunks.map((chunk, i) => (
          <RowWrapper key={i} lastRow={i === chunks.length - 1}>
            {chunk.map((option, j) => (
              <CardWrapper
                key={option.value}
                style={{
                  maxWidth: this._getMaxWidthForPosition(i, j),
                }}
              >
                <SelectableCard
                  label={option.label}
                  imageSource={option.imageSource}
                  selected={value === option.value}
                  onChange={newValue => this.handleChange(option, newValue)}
                  color={cardColor}
                  style={cardStyle}
                />
              </CardWrapper>))}
          </RowWrapper>
        ))}
      </Wrapper>
    );
  }
}


CardOptions.propTypes = {
  itemsPerLine: number,
  value: string,
  nullable: bool,
  cardColor: string.isRequired,
  cardStyle: View.propTypes.style,
  style: View.propTypes.style,
  options: arrayOf(shape({
    value: string.isRequired,
    label: string.isRequired,
    imageSource: Image.propTypes.source,
  })).isRequired,
  onChange: func.isRequired,
};
CardOptions.defaultProps = {
  itemsPerLine: 2,
  value: null,
  nullable: false,
  cardStyle: null,
  style: null,
};

export default CardOptions;
