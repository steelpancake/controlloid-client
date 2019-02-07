import React from 'react';
import SvgUri from 'react-native-svg-uri';
import { Animated, View } from 'react-native';
import * as Types from '../../types';
import { TouchReceiverMixin } from '../utils';

export default class Button extends TouchReceiverMixin(React.Component) {
  static propTypes = {
    x: Types.number.isRequired,
    y: Types.number.isRequired,
    size: Types.number.isRequired,
    theme: Types.controllerTheme.isRequired,
    dispatch: Types.func.isRequired,
    emit: Types.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.touchId = null;
    this.opacity = new Animated.Value(1);
  }

  buttonPress() {
    const { dispatch, emit } = this.props;
    dispatch({ [emit]: 1 }, true);
    this.opacity.setValue(0.25);
  }

  buttonRelease() {
    const { dispatch, emit } = this.props;
    dispatch({ [emit]: 0 }, true);
    this.opacity.setValue(1);
  }

  onTouchDown(id) {
    if (this.touchId === null) {
      this.touchId = id;
      this.buttonPress();
      return true;
    }
    return false;
  }

  onTouchMove(touch) {
    if (this.touchId === touch.identifier) {
      const { x, y, size } = this.props;
      if (x > touch.locationX || touch.locationX > x + size
        || y > touch.locationY || touch.locationY > y + size) {
        this.touchId = null;
        this.buttonRelease();
        return false;
      }
    } else if (this.touchId === null) {
      this.touchId = touch.identifier;
      this.buttonPress();
    }
    return true;
  }

  onTouchUp(id) {
    if (this.touchId === id) {
      this.touchId = null;
      this.buttonRelease();
    }
  }

  render() {
    const {
      x, y, size, theme, ...viewProps
    } = this.props;
    return (
      <View
        {...viewProps}
        style={{
          top: y,
          left: x,
          width: size,
          height: size,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={{ opacity: this.opacity }}>
          <SvgUri
            width={size}
            height={size}
            svgXmlData={theme.knob}
          />
        </Animated.View>
      </View>
    );
  }
}
