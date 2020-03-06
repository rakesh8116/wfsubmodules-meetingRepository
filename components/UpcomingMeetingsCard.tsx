import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MeetingModel } from '@models/Meetings';
import { theme } from '@styles/theme';
import { viewport } from '@styles/viewport';

interface IProps {
  meetings: MeetingModel;
  testID: string;
  index: number;
  onClick: () => void;
}

export const UpcomingMeetingsCard = (props: IProps) => {
  const {meetings} = props;
  const profile = meetings ? meetings.getProfile() : '';
  const profileName = profile ? profile.getName() : '';
  const onClick = () => props.onClick();

  return (
    <TouchableOpacity
      style={styles.meetingDetailsContainer}
      accessibilityLabel={'VIEW_MEETINGS_TOUCHABLE_OPACITY'}
      onPress={onClick}
    >
      <View style={styles.start}>
        <Text
          style={styles.time}
          numberOfLines={1}
          testID={'MEETING_DURATION_' + meetings.getMeetingDuration()}
          accessibilityLabel={'MEETING_DURATION_' + meetings.getMeetingDuration()}
        >
          {meetings.getMeetingDuration()}
        </Text>
        <Text
          style={styles.modifiedDisplayDate}
          numberOfLines={1}
          testID={'DISPLAY_DATE_' + meetings.getModifiedDisplayDate()}
          accessibilityLabel={'DISPLAY_DATE_' + meetings.getModifiedDisplayDate()}
        >
          {meetings.getModifiedDisplayDate()}
        </Text>
      </View>
      <View style={styles.verticalDivider}/>
      <View style={styles.middle}>
        <Text
          style={styles.name}
          numberOfLines={1}
          testID={'RESPONDENT_NAME_' + profileName}
          accessibilityLabel={'RESPONDENT_NAME_' + profileName}
        >
          {profileName}
        </Text>
        <Text
          style={styles.meetingStatus}
          testID={'MEETING_STATUS_' + meetings.getStatus()}
          accessibilityLabel={'MEETING_STATUS_' + meetings.getStatus()}
        >
          {meetings.getStatus()}
        </Text>
      </View>
      <View style={styles.last}>
        <Text
          style={styles.button}
          testID={'VIEW_BUTTON_' + props.index}
          accessibilityLabel={'VIEW_BUTTON_' + props.index}
        >
          VIEW
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  meetingDetailsContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginTop: 16,
  },
  start: {
    flex: 7,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
  },
  middle: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  last: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  verticalDivider: {
    borderLeftWidth: (viewport.width * 0.005),
    height: 36,
    borderLeftColor: theme.colors.whiteTwo,
    paddingRight: 13,
  },
  name: {
    color: theme.colors.black,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: 'OpenSans-Semibold',
  },
  time: {
    color: theme.colors.black,
    fontSize: 15,
    letterSpacing: 0.1,
    lineHeight: 24,
    fontFamily: 'OpenSans-Semibold',
  },
  modifiedDisplayDate: {
    color: theme.colors.blueGray,
    fontSize: 12,
    letterSpacing: 0,
    fontFamily: 'OpenSans',
  },
  meetingStatus: {
    color: theme.colors.blueGray,
    fontSize: 12,
    letterSpacing: 0,
    fontFamily: 'OpenSans',
  },
  button: {
    color: theme.colors.reddishOrange,
    paddingHorizontal: '5%',
    paddingBottom: '7.5%',
    fontSize: 13,
    fontFamily: 'OpenSans-Semibold',
    letterSpacing: 0.09,
  },
});
