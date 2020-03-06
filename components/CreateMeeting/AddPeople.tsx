import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProfileModel } from '@models/Profile';
import { theme } from '@styles/theme';
import { RouteNames } from '@navigation/routes';
import { INavigation } from 'navigation';

interface IProps {
  recipient: ProfileModel;
  setRecipient: (item: ProfileModel) => void;
  navigation: INavigation;
  closeFlag: () => void;
}

export default class AddPeople extends Component<IProps> {
  public render(): React.ReactNode {
    const {recipient} = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.handleOnPress}
        testID={'ADD_PEOPLE_TEXT_CONTAINER'}
        accessibilityLabel={'ADD_PEOPLE_TEXT_CONTAINER'}
      >
        <Icon name="person" style={{fontSize: 30, color: 'orange'}}/>
        {
          Object.entries(recipient).length === 0 && recipient.constructor === Object ?
            <Text
              style={styles.itemText}
              testID={'ADD_PEOPLE_TEXT'}
              accessibilityLabel={'ADD_PEOPLE_TEXT'}
            >
              Add People
            </Text> :
            <View style={styles.MeetingContainer}>
              <Text
                style={styles.MeetingHeading}
                testID={'RECIPIENT_TEXT'}
                accessibilityLabel={'RECIPIENT_TEXT'}
              >
                Meeting with
              </Text>
              <Text
                style={styles.MeetingRecipient}
                testID={'RECIPIENT_NAME'}
                accessibilityLabel={'RECIPIENT_NAME'}
              >
                {this.props.recipient.getName()}
              </Text>
            </View>
        }
      </TouchableOpacity>
    );
  }

  public onSelection = (item: ProfileModel) => this.props.setRecipient(item);

  private handleOnPress = () => {
    this.props.navigation.push(RouteNames.allAcceptedConnections,
      { onSelection: this.onSelection, from: 'AddPeople' });
    this.props.closeFlag();
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
  },
  itemText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: theme.viewport.width * 0.075,
    color: '#131415',
  },
  MeetingContainer: {
    flex: 1,
    paddingLeft: theme.viewport.width * 0.075,
  },
  MeetingHeading: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: '#4a4a4a',
    fontSize: 13,
    lineHeight: 18,
  },
  MeetingRecipient: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#131415',
  },
  containerWithRecipient: {
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
    flexDirection: 'row',
  },
});
