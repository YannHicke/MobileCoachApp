import React, { Component } from 'react'
import { Image } from 'react-native'
import resolveAssetSource from 'resolveAssetSource'
import PropTypes from 'prop-types'

export default class ScaledImage extends Component {
  constructor (props) {
    super(props)
    this.scaleFactor = null
  }

  componentWillMount () {
    let source = resolveAssetSource(this.props.source)
    const { width, height } = source
    if (this.props.width && !this.props.height) {
      this.setState({
        width: this.props.width,
        height: height * (this.props.width / width)
      })
      if (this.props.setScaleFactor) {
        this.props.setScaleFactor(this.props.width / width)
      }
      if (this.props.setDimensions) {
        this.props.setDimensions({
          width: this.props.width,
          height: height * (this.props.width / width),
          scaleFactor: this.props.width / width
        })
      }
    } else if (!this.props.width && this.props.height) {
      // Check if maxWidth is set, and the calculated width exeeds it
      if (
        this.props.maxWidth &&
        width * (this.props.height / height) > this.props.maxWidth
      ) {
        this.setState({
          width: this.props.maxWidth,
          height: height * (this.props.maxWidth / width)
        })
        if (this.props.setScaleFactor) {
          this.props.setScaleFactor(this.props.maxWidth / width)
        }
        if (this.props.setDimensions) {
          this.props.setDimensions({
            width: this.props.maxWidth,
            height: height * (this.props.maxWidth / width),
            scaleFactor: this.props.maxWidth / width
          })
        }
      } else {
        this.setState({
          width: width * (this.props.height / height),
          height: this.props.height
        })
        if (this.props.setScaleFactor) {
          this.props.setScaleFactor(this.props.height / height)
        }
        if (this.props.setDimensions) {
          this.props.setDimensions({
            width: width * (this.props.height / height),
            height: this.props.height,
            scaleFactor: this.props.height / height
          })
        }
      }
    } else {
      this.setState({ width: width, height: height })
    }
  }

  getDimensions () {
    return {
      width: this.state.width,
      height: this.state.height,
      scaleFactor: this.scaleFactor
    }
  }

  render () {
    return (
      <Image
        source={this.props.source}
        style={[
          this.props.style,
          { height: this.state.height, width: this.state.width }
        ]}
      />
    )
  }
}

ScaledImage.propTypes = {
  source: Image.propTypes.source.isRequired,
  width: PropTypes.number,
  // If the the width is defined by "height" and the computed width exeeds the (optional) maxWidth property,
  // the maxWidth is used instead.
  maxWidth: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  setScaleFactor: PropTypes.func
}
