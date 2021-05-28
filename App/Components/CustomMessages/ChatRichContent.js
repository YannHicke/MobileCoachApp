import React, { PureComponent } from 'react';
import { Dimensions, View } from 'react-native';
import HTML from 'react-native-render-html';

import { Colors } from '../../Themes/';

class ChatRichContent extends PureComponent {
  render() {
    return (
      <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
        <HTML
          html={'<web>' + this.props.content + '</web>'}
          imagesMaxWidth={Dimensions.get('window').width}
          tagsStyles={{
            web: {
              color: Colors.messageBubbles.left.text,
            },
          }}
          classesStyles={{}}
          containerStyle={{}}
          baseFontStyle={{ fontSize: 16 }}
        />
      </View>
    );
  }
}

export default ChatRichContent;
