import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@styles/theme';
import { MeetingModel } from '@models/Meetings';
import { AcceptRejectComponent } from '@components/AcceptRejectComponent';
import Icon from 'react-native-vector-icons/Feather';
import { meetingStatusType } from '@constants/config';

interface IProps {
  meeting: MeetingModel;
  updateMeeting: (meetingId: string, status: string) => void;
  testID: string;
  index: number;
  last: number;
}

export const MeetingRequestCard = (props: IProps) => {
  const {meeting} = props;
  const profile = meeting.getProfile();

  const updateMeetingAction = (action: boolean) => {
    const status = action ? meetingStatusType.Accepted : meetingStatusType.Rejected;
    props.updateMeeting(meeting.getId(), status);
  };

  const getContainerStyle = () => {
    return props.last === 0 ? {...styles.containerFirst, ...styles.containerLast} :
      props.index === 0 ? styles.containerFirst :
        props.index === props.last ? styles.containerLast : null;
  };

  const companyName = profile ? profile.getCompanyName() : '';
  const profileName = profile ? profile.getName() : '';
  return (
    <View
      style={getContainerStyle()}
    >
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="calendar" color="black" size={15} style={styles.icon}/>
            <Text style={styles.title} numberOfLines={1}>{meeting.getTitle()}</Text>
          </View>
          <Text style={styles.date}>{meeting.getModifiedDisplayDate()}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.colOne}>
            <View>
              <Text style={styles.duration}>
                {props.meeting.getMeetingDuration()}
              </Text>
            </View>
            <View style={{paddingTop: theme.viewport.height * 0.01}}>
              <Text style={styles.company} numberOfLines={1}>{companyName}</Text>
              <Text style={styles.name}>{profileName}</Text>
            </View>
          </View>
          <View style={styles.colTwo}>
            <AcceptRejectComponent updateAction={updateMeetingAction}/>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFirst: {
    paddingLeft: (theme.viewport.width * 0.066),
  },
  containerLast: {
    paddingRight: (theme.viewport.width * 0.05),
  },
  cardContainer: {
    width: (theme.viewport.width * 0.87),
    paddingRight: (theme.viewport.width * 0.061),
    paddingLeft: (theme.viewport.width * 0.045),
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: theme.colors.white,
    fontFamily: 'BrandonText-Medium',
    elevation: 20,
    shadowColor: theme.colors.black23,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colOne: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  colTwo: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 15,
    lineHeight: 24,
    width: theme.viewport.width / 2,
    color: theme.colors.titleBlack,
  },
  duration: {
    fontSize: 12,
    paddingTop: 1.5,
    color: theme.colors.blueGrey,
  },
  name: {
    fontSize: 11,
  },
  company: {
    fontSize: 13,
    color: theme.colors.titleBlack,
  },
  date: {
    color: theme.colors.warmGrey,
  },
  icon: {
    paddingRight: (theme.viewport.width * 0.0333),
  },
});
