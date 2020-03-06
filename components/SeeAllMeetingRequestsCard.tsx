import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@styles/theme';
import { MeetingModel } from '@models/Meetings';
import { AcceptRejectComponent } from '@components/AcceptRejectComponent';
import { viewport } from '@styles/viewport';
import { meetingStatusType } from '@constants/config';
import ProfileIcon from '@components/ProfileIcon';
import { IProfileState } from '@modules/profile/reducer';

interface IProps {
  meeting: MeetingModel;
  updateMeeting: (meetingId: string, status: string) => void;
  testID: string;
  index: number;
  profile: IProfileState;
}

export const SeeAllMeetingRequestsCard = (props: IProps) => {
  const {meeting} = props;
  const profile = meeting.getProfile();

  const updateMeetingAction = (action: boolean) => {
    const status = action ? meetingStatusType.Accepted : meetingStatusType.Rejected;
    props.updateMeeting(meeting.getId(), status);
  };

  const companyName = profile ? profile.getCompanyName() : '';
  const name = profile ? profile.getName() : '';
  const thumbnailUrl = profile ? profile.getProfilePicUrl() : '';
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.profileIcon}>
            <ProfileIcon
              imgSource={thumbnailUrl ? thumbnailUrl : ''}
              name={name ? name : ''}
              tag={'ToolbarHeader'}
            />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.colOne}>
            <Text style={styles.title} numberOfLines={1}>{meeting.getTitle()}</Text>
            <View style={styles.rowOne}>
              <Text style={styles.DateTime}>{meeting.getModifiedDisplayDate()}, </Text>
              <Text style={styles.DateTime}>
                {props.meeting.getMeetingDuration()}
              </Text>
            </View>
            <View>
              <Text style={styles.company} numberOfLines={1}>{companyName}</Text>
              <Text style={styles.name}>{name}</Text>
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
  cardContainer: {
    height: (viewport.height * 0.15),
    backgroundColor: theme.colors.white,
    fontFamily: 'BrandonText-Medium',
    paddingHorizontal: (viewport.width * 0.045),
    paddingTop: (viewport.width * 0.05),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowOne: {
    flexDirection: 'row',
  },
  colOne: {
    flexDirection: 'column',
    flex: 0.7,
    justifyContent: 'flex-start',
  },
  colTwo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.titleBlack,
  },
  DateTime: {
    fontSize: 12,
    paddingTop: 1.5,
    color: theme.colors.blueGray,
  },
  name: {
    fontSize: 11,
  },
  company: {
    fontSize: 13,
    color: theme.colors.titleBlack,
  },
  icon: {
    paddingRight: (viewport.width * 0.0333),
  },
  profileIcon: {
    flexDirection: 'column',
  },
});
