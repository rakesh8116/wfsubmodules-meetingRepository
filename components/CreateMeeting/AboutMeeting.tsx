import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '@styles/theme';

interface IProps {
  setAboutMeeting: (details: string) => void;
}

interface IState {
  textAreaVisible: boolean;
  details: string;
}

export default class AboutMeeting extends Component<IProps, IState> {
  public state = {
    textAreaVisible: false,
    details: '',
  };

  public render(): React.ReactNode {
    const {textAreaVisible, details} = this.state;

    if (!textAreaVisible && '' !== details) {
      return this.renderWithDetails();
    } else if (!textAreaVisible && '' === details) {
      return this.renderWithoutDetails();
    }

    return this.renderWithTextArea();
  }

  private editIcon = () => <Icon name="edit" style={{fontSize: 30, color: 'orange'}}/>;

  private renderWithoutDetails = () => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.handleOnPress}
        testID={'ABOUT_MEETING_TEXT_WITHOUT_DETAIL'}
        accessibilityLabel={'ABOUT_MEETING_TEXT_WITHOUT_DETAIL'}
      >
        {this.editIcon()}
        <Text
          style={styles.primaryAbout}
          testID={'ABOUT_MEETING_TEXT'}
          accessibilityLabel={'ABOUT_MEETING_TEXT'}
        >
          About Meeting
        </Text>
      </TouchableOpacity>
    );
  }

  private renderWithDetails = () => {
    return (
      <TouchableOpacity
        style={styles.containerWithDetails}
        onPress={this.handleOnPress}
        testID={'ABOUT_MEETING_TEXT_WITH_DETAIL'}
        accessibilityLabel={'ABOUT_MEETING_TEXT_WITH_DETAIL'}
      >
        {this.editIcon()}
        <View style={styles.detailContainer}>
          <Text
            style={styles.aboutWithDetails}
            testID={'ABOUT_MEETING_TEXT'}
            accessibilityLabel={'ABOUT_MEETING_TEXT'}
          >
            About Meeting
          </Text>
          <Text
            style={styles.details}
            testID={'ABOUT_MEETING_TEXT_DETAILS'}
            accessibilityLabel={'ABOUT_MEETING_TEXT_DETAILS'}
          >
            {this.state.details}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  private renderWithTextArea = () => {
    return (
      <View
        style={styles.containerWithDetails}
      >
        {this.editIcon()}
        <TextInput
          numberOfLines={5}
          value={this.state.details}
          testID="about-meeting-area"
          accessibilityLabel="about-meeting-area"
          onSubmitEditing={this.handleSubmitEditing}
          onChangeText={this.handleChangeText}
          autoFocus={true}
          onBlur={this.handleOnBlur}
          style={styles.detailContainer}
          multiline={true}
        />
      </View>
    );
  }

  private handleChangeText = (text: string) =>
    this.setState({ details: text })

  private handleSubmitEditing = () =>
    this.setState({ textAreaVisible: false }, () => this.props.setAboutMeeting(this.state.details))

  private handleOnPress = () =>
    this.setState({ textAreaVisible: true })

  private handleOnBlur = () =>
    this.setState({ textAreaVisible: false }, () => this.props.setAboutMeeting(this.state.details))
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
  },
  containerWithDetails: {
    flexDirection: 'row',
    paddingVertical: theme.viewport.width * 0.05,
    paddingHorizontal: theme.viewport.width * 0.075,
  },
  primaryAbout: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#131415',
    paddingLeft: theme.viewport.width * 0.075,
  },
  aboutWithDetails: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: '#4a4a4a',
    fontSize: 13,
    lineHeight: 18,
  },
  detailContainer: {
    paddingHorizontal: theme.viewport.width * 0.075,
    flex: 1,
    textAlignVertical: 'top',
  },
  details: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    lineHeight: 20,
    fontSize: 13,
    color: '#131415',
  },
});
