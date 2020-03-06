import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking, Alert } from 'react-native';
import { MeetingModel } from '@models/Meetings';
import { theme } from '@styles/theme';
import { connect } from 'react-redux';
import { getMeetingDetails, updateMeetingStatus } from '@modules/meetings/actions';
import {
  getMeetingDetailsLoading,
  getMeetingsDetails,
  getUpdateMeetingStatusLoading,
} from '@modules/meetings/selectors';
import { TABBED_SECTION_CARD_HORIZONTAL_PADDING, viewport } from '@styles/viewport';
import { INavigation } from 'navigation';
import { ProfileModel } from '@models/Profile';
import { ProfileComponent } from '@components/ProfileComponent';
import { DateHelper } from '@utils/DateHelper';
import { MeetingConstantsConfig, meetingStatusType } from '@constants/config';
import Icon from 'react-native-vector-icons/Entypo';
import Lines from '@shimmer/components/Lines';
import { Shimmer } from '@shimmer/constants';
import { AcceptRejectButton } from '@components/AcceptRejectButton';
import { Toast } from '@components/Toast';
import VerticalList from '@shimmer/components/VerticalList';
import { getUserProfileEcosystem } from '@modules/profile/selectors';
import { font } from '@styles/fonts/font';
import { ScreenHeader } from '@components/ScreenHeader';
import { BackIcon } from '@components/BackIcon';
import { DeleteIcon } from '@components/DeleteIcon';
import { colors } from '@styles/colors';
import { LANG_ENGLISH } from '@translations/index';
import FullScreenLoader from '@components/FullScreenLoader';

interface IProps {
  navigation: INavigation;
  meetingDetails: MeetingModel;
  getMeetingDetails: (userProfileId: string, meetingId: string, userEcosystemId: number) => void;
  thumbnailUrl?: any;
  testID?: string;
  id?: string;
  summary?: string;
  isLoadingMeetingDetails?: boolean;
  updateMeetingStatus: (meetingId: string, status: string) => void;
  userEcosystemId: number;
  updateMeetingStatusLoading: boolean;
}

interface IState {
  localStatusState: string;
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    getMeetingDetails: (userProfileId: string, meetingId: string, userEcosystemId: number) => dispatch
    (getMeetingDetails(userProfileId, meetingId, userEcosystemId)),
    updateMeetingStatus: (meetingId: string, status: string) => dispatch(updateMeetingStatus(meetingId, status)),
  };
};

export const mapStateToProps = (state: any) => {
  const ecosystem = getUserProfileEcosystem(state);
  return {
    meetingDetails: getMeetingsDetails(state),
    isLoadingMeetingDetails: getMeetingDetailsLoading(state),
    userEcosystemId: ecosystem && ecosystem.id,
    updateMeetingStatusLoading: getUpdateMeetingStatusLoading(state),
  };
};

export class MeetingDetailsContainer extends Component<IProps, IState> {

  public state: IState = {
    localStatusState: '',
  };

  public componentDidMount() {
    const meetingId = this.props.navigation.getParam('meetingId');
    const userProfileId = this.props.navigation.getParam('profileId');
    this.props.getMeetingDetails(userProfileId, meetingId, this.props.userEcosystemId);
  }

  public componentDidUpdate(prevProps: IProps) {
    if ( JSON.stringify(prevProps.meetingDetails) !== JSON.stringify(this.props.meetingDetails) ) {
      this.setState({
        localStatusState: this.props.meetingDetails.getStatus(),
      });
    }
    if ( prevProps.meetingDetails &&
      (prevProps.meetingDetails.getStatus() !== MeetingConstantsConfig.STATUS_CANCELLED &&
        this.props.meetingDetails.getStatus() === MeetingConstantsConfig.STATUS_CANCELLED) ) {
      const requestedTo = this.props.meetingDetails.getRequestedTo();
      const userProfileId = this.props.navigation.getParam('profileId');
      if ( userProfileId !== requestedTo ) {
        this.props.navigation.goBack();
        Toast.info({title: LANG_ENGLISH.SUCCESS_MESSAGES.MEETING_DELETED, duration: 3000});
      }
    }
  }

  public updateMeetingAction = (action: boolean) => {
    const meetingId = this.props.navigation.getParam('meetingId');
    const status = action ? meetingStatusType.Accepted : meetingStatusType.Rejected;
    const buttonStatus = action ? MeetingConstantsConfig.MEETING_CONFIRMED : MeetingConstantsConfig.STATUS_REQUESTED;
    if ( this.state.localStatusState !== meetingStatusType.Accepted ) {
      this.setState({localStatusState: buttonStatus});
      this.updateMeeting(meetingId, status);
    }
  };

  public isMeetingDeleted = (): boolean => {
    if ( !this.props.meetingDetails ) {
      return false;
    }
    if ( this.props.meetingDetails.getStatus() === MeetingConstantsConfig.STATUS_CANCELLED ) {
      return true;
    }
    return false;
  };

  public render() {
    const {meetingDetails} = this.props;
    const click = () => {
    };

    if ( this.props.isLoadingMeetingDetails ) {
      return this.getShimmer();
    }

    if ( !meetingDetails || !meetingDetails.profile ) {
      return null;
    }

    if ( meetingDetails ) {
      const requestedTo = meetingDetails.getRequestedTo();
      const profileId = this.props.navigation.getParam('profileId');
      const deleteIcon = DeleteIcon({
        deleteIconStyle: styles.deleteIconStyle,
        handler: () => this.showDialog(),
      });

      const screenHeaderProps = {
        icon1: BackIcon({backIconStyle: styles.backIconStyle, handler: () => this.backHandler()}),
        icon3: this.isMeetingDeleted() ? undefined : profileId !== requestedTo ? deleteIcon : undefined,
      };

      const profile: ProfileModel = meetingDetails.profile;
      const date = DateHelper.getModifiedDateTimeStamp(meetingDetails.scheduled!.startDateTime);
      const day = DateHelper.getModifiedDay(date);
      return (
        <View style={styles.container}>
          <View>
            <ScreenHeader
              {...screenHeaderProps}
              containerStyle={styles.headerContainerStyle}
            />
          </View>
          <View style={styles.profileView}>
            <View style={styles.border}/>
            <ProfileComponent
              userId={profile.getUserId()}
              name={profile.getName()}
              profilePic={''}
              designation={profile.getDesignation()}
              companyName={profile.getCompanyName()}
              expertise={''}
              isMultiLined={true}
              containerStyle={styles.profileContainerStyle}
              profileDetailsStyle={styles.profileDetailsStyle}
              onPress={click}
            />
          </View>
          <View>
            <Text
              style={styles.titleMeetingDetails}
              testID={'MEETING_DETAILS_TITLE'}
              accessibilityLabel={'MEETING_DETAILS_TITLE'}
            >
              {meetingDetails.getTitle()}
            </Text>
          </View>
          <View>
            <Text
              style={styles.day}
              testID={'MEETING_DETAILS_DAY'}
              accessibilityLabel={'MEETING_DETAILS_DAY'}
            >
              {day && day.toUpperCase()}
            </Text>
            <Text
              style={styles.date}
              testID={'MEETING_DETAILS_DATE'}
              accessibilityLabel={'MEETING_DETAILS_DATE'}
            >
              {date} <Icon name="dot-single" style={styles.dotIcon} size={15}/> {meetingDetails.getMeetingDuration()}
            </Text>
          </View>
          {this.seperator()}
          {this.Summary(meetingDetails)}
          {this.meetingType(meetingDetails)}
          {this.loader()}
        </View>
      );
    }
  }

  private updateMeeting = (meetingId: string, status: string) => this.props.updateMeetingStatus(meetingId, status);
  private seperator = () => <View style={styles.separator}/>;

  private getShimmer = () =>
    (
      <View style={styles.shimmerView}>
        <VerticalList
          autoRun={true}
          lines={1}
          items={1}
          tag={'sl'}
          isCircle={true}
          itemStyle={styles.shimmerItem}
          imageHolderValues={{...Shimmer.PROFILE_ROUNDED_ICON}}
          lineValues={{height: 10, width: 250}}
          listStyle={{...styles.shimmerList}}
        />
        <View>
          <Lines
            count={2}
            tag={'Meeting-Details'}
            line={{height: (viewport.height * 0.1), width: (viewport.width * 0.9), style: styles.bodyStyle}}
            style={styles.bodyContainerStyle}
          />
        </View>
      </View>
    );

  private goToURL = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if ( supported ) {
        Linking.openURL(url);
      } else {
        // tslint:disable-next-line:no-console
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  };

  private meetingType = (meetingDetails: MeetingModel) => {
    const requestedTo = meetingDetails.getRequestedTo();
    const profileId = this.props.navigation.getParam('profileId');
    const cancelledMessage: string = requestedTo === profileId ?
      LANG_ENGLISH.Meeting.MEETING_DELETED_RECEIVER : LANG_ENGLISH.Meeting.MEETING_DELETED_SENDER;

    if ( meetingDetails.getStatus() === MeetingConstantsConfig.MEETING_CONFIRMED
      && meetingDetails.getType() === 'zoom' ) {
      return (
        <View>
          <View style={styles.videoCallView}>
            <Text style={styles.zoomHeader} testID={`zoom-title-text`} accessibilityLabel={`zoom-title-text`}>
              Remote Zoom Link
            </Text>
            <Text
              style={styles.zoomLink}
              onPress={() => this.goToURL(meetingDetails.getZoom())}
              testID={`zoom-link-text`}
              accessibilityLabel={`zoom-link--text`}
            >
              {meetingDetails.getZoom()}
            </Text>
          </View>
          {this.seperator()}
        </View>
      );
    } else if ( (meetingDetails.getStatus() === MeetingConstantsConfig.MEETING_PENDING)
      && (requestedTo === profileId) ) {
      return (
        <AcceptRejectButton
          meetingDetails={meetingDetails}
          updateAction={this.updateMeetingAction}
        />
      );
    } else if ( this.isMeetingDeleted() ) {
      return (
        <View style={styles.cancelledMeetingTextView}>
          <Text
            style={styles.cancelledMeetingText}
            testID={'meeting-details-canceled-text'}
            accessibilityLabel={'meeting-details-canceled-text'}
          >
            {cancelledMessage}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  private Summary = (meetingDetails: MeetingModel) => {
    if ( meetingDetails && meetingDetails.summary && meetingDetails.summary.length > 0 ) {
      return (
        <View>
          <Text
            style={styles.summary}
            testID={`MEETING_SUMMARY_TEXT`}
            accessibilityLabel={`MEETING_SUMMARY_TEXT`}
          >
            {meetingDetails.getSummary()}
          </Text>
          {this.seperator()}
        </View>
      );
    } else {
      return null;
    }
  };

  private backHandler = () => {
    this.props.navigation.goBack();
  };

  private showDialog = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete the meeting?',
      [
        {text: 'Delete', onPress: this.deleteHandler},
        {text: 'No'},
      ],
      {cancelable: true},
    );
  };

  private deleteHandler = () => {
    const meetingId: string = this.props.navigation.getParam('meetingId');
    this.props.updateMeetingStatus(meetingId, 'cancelled');
  };

  private loader = () => {
    const {updateMeetingStatusLoading} = this.props;
    return (
      <FullScreenLoader
        showLoader={updateMeetingStatusLoading}
        customStyle={styles.loader}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  videoCallView: {
    paddingHorizontal: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
  },
  markerView: {
    width: viewport.width * 0.02,
    backgroundColor: theme.colors.darkOrange,
  },
  shimmerView: {
    paddingHorizontal: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
  },
  coverImageStyle: {
    marginLeft: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
  },
  shimmerList: {
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.whiteTwo,
    width: '100%',
    marginVertical: viewport.height * 0.04,
  },
  skillsShimmer: {
    marginLeft: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
    paddingVertical: viewport.width * 0.04,
  },
  bodyContainerStyle: {
    marginTop: viewport.width * 0.07,
  },
  cancelledMeetingTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.viewport.height * 0.02,
  },
  cancelledMeetingText: {
    fontSize: 15,
    width: theme.viewport.width * 0.8,
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center',
  },
  headingStyle: {
    fontFamily: 'Georgia-Bold',
    fontSize: 19,
    color: theme.colors.black,
    letterSpacing: 0.13,
  },
  titleShimmer: {
    marginLeft: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
    paddingVertical: viewport.width * 0.01,
  },
  bodyStyle: {
    paddingVertical: viewport.width * 0.03,
  },
  defaultInitialsView: {
    height: viewport.width * 0.16,
    width: viewport.width * 0.16,
    borderRadius: (viewport.width * 0.16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
  },
  titleMeetingDetails: {
    fontFamily: 'Georgia-Bold',
    color: theme.colors.black,
    fontSize: 24,
    paddingHorizontal: viewport.width * 0.07,
    paddingTop: viewport.height * 0.03,
  },
  day: {
    fontSize: 14,
    fontFamily: font.OpenSans,
    color: theme.colors.black,
    paddingHorizontal: viewport.width * 0.07,
    paddingBottom: viewport.height * 0.005,
    paddingTop: viewport.height * 0.05,
  },
  date: {
    fontSize: 14,
    fontFamily: font.OpenSans,
    color: theme.colors.black,
    paddingHorizontal: viewport.width * 0.07,
  },
  dotIcon: {
    color: theme.colors.black,
  },
  duration: {
    fontFamily: font.OpenSans,
    color: theme.colors.bluishBlack,
    fontSize: 14,
    paddingHorizontal: viewport.width * 0.07,
  },
  summary: {
    fontFamily: 'OpenSans-Light',
    color: theme.colors.bluishBlack,
    fontSize: 13,
    paddingHorizontal: viewport.width * 0.07,
  },
  zoomHeader: {
    fontFamily: 'OpenSans-Semibold',
    color: theme.colors.black,
  },
  zoomLink: {
    color: theme.colors.softBlue,
    marginTop: 5,
  },
  profileView: {
    flexDirection: 'row',
  },
  border: {
    borderStartWidth: viewport.width * 0.02,
    borderColor: theme.colors.yellow,
    borderStyle: 'solid',
    height: viewport.height * 0.13,
  },
  profileDetailsStyle: {
    paddingRight: viewport.width * 0.25,
    paddingLeft: theme.viewport.width * 0.02,
  },
  profileContainerStyle: {
    width: theme.viewport.width * 0.9,
    paddingLeft: viewport.width * 0.04,
  },
  backIconStyle: {
    color: theme.colors.black,
  },
  deleteIconStyle: {
    color: theme.colors.reddishOrange,
  },
  headerContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: viewport.height * 0.11,
    paddingHorizontal: viewport.width * 0.04,
    borderBottomWidth: 0,
  },
  loader: {
    height: viewport.height,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetailsContainer);
