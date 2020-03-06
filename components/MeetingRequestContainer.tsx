import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getMeetingRequests } from '@modules/meetings/selectors';
import { theme } from '@styles/theme';
import { MeetingRequestCard } from '@modules/meetings/components/MeetingRequestCard';
import { fetchPendingMeetings, updateMeetingStatus } from '@modules/meetings/actions';
import { DateHelper } from '@utils/DateHelper';
import { IProfileState } from '@modules/profile/reducer';
import { MeetingModel } from '@models/Meetings';
import { MeetingConstants } from '@constants/shared';
import { MeetingConstantsConfig } from '@constants/config';
import { seeAllButton } from '@modules/articles/constants';
import { HeadingComponent } from '@components/HeadingComponent';
import {
  TABBED_SECTION_HEADER_HORIZONTAL_MARGIN,
  TABBED_SECTION_HEADER_VERTICAL_PADDING,
  TABBED_SECTION_VERTICAL_MARGIN,
  TABBED_SECTION_VERTICAL_PADDING,
  viewport,
} from '@styles/viewport';
import { getUserProfileEcosystem } from '@modules/profile/selectors';
import { getMeetingReload, isRefreshHome } from '@modules/root/selectors';
import { RouteNames } from '@navigation/routes';
import { LANG_ENGLISH } from '@translations/index';

interface IProps {
  profile: IProfileState;
  getPendingMeetings: (id: string, currentDateTime: Date, page: number,
                       limit: number, userEcosystemId: number, isRefresh: boolean) => void;
  updateMeetingStatus: (meetingId: string, status: string) => void;
  requestedMeetings: any;
  navigation: {
    navigate: (url: string, data: {}) => void,
  };
  userEcosystemId: number;
  isRefreshHome: boolean;
  meetingReload: { reload: boolean, source: string };
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    getPendingMeetings: (id: string, currentDateTime: Date, page: number,
                         limit: number, userEcosystemId: number, isRefresh: boolean) =>
      dispatch(fetchPendingMeetings(id, currentDateTime, page, limit, userEcosystemId, isRefresh)),
    updateMeetingStatus: (meetingId: string, status: string) => dispatch(updateMeetingStatus(meetingId, status)),
  };
};

export const mapStateToProps = (state: any) => {
  const ecosystem = getUserProfileEcosystem(state);
  return {
    profile: state.profile.userProfile,
    requestedMeetings: getMeetingRequests(state),
    userEcosystemId: ecosystem && ecosystem.id,
    isRefreshHome: isRefreshHome(state),
    meetingReload: getMeetingReload(state),
  };
};

export class MeetingRequestContainer extends React.Component<IProps, any> {
  public componentDidMount(): void {
    this.getMeetings(this.props.isRefreshHome);
  }

  public onClick = () => {
    this.props.navigation.navigate(RouteNames.seeAllMeetingRequests, {});
  };

  public componentDidUpdate(prevProps: any): void {
    const prevProfile = prevProps.profile;
    const newProfile = this.props.profile;
    const fromNotification = this.props.meetingReload.source === LANG_ENGLISH.NotificationScreen.TITLE;
    if ( (prevProfile.profileId === undefined && newProfile.profileId !== undefined)
      || (prevProps.isRefreshHome !== this.props.isRefreshHome && this.props.isRefreshHome) ||
      (prevProps.meetingReload.reload !== this.props.meetingReload.reload && this.props.meetingReload &&
      fromNotification) ) {
      this.getMeetings(this.props.isRefreshHome || this.props.meetingReload.reload);
    }
  }

  public render() {
    const {requestedMeetings} = this.props;
    return (
      <React.Fragment>
        {requestedMeetings.length > 0 &&
        <View>
          <View style={styles.container}>
            <HeadingComponent
              headerStyles={styles.headerStyle}
              headingStyles={styles.headingStyle}
              buttonText={seeAllButton}
              buttonStyle={this.props.requestedMeetings.length <= 1 && {display: 'none'}}
              handleButton={this.onClick}
              heading={MeetingConstants.MEETING_REQUESTS}
            />
          </View>
          <FlatList
            style={styles.requestContainer}
            data={requestedMeetings.slice(0, 10)}
            renderItem={this.renderCards}
            horizontal={true}
            keyExtractor={this.keyExtractor}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.separator}
          />
        </View>
        }
      </React.Fragment>
    );
  }

  public renderCards = ({item, index}: { item: MeetingModel, index: number }) => {
    return (
      <MeetingRequestCard
        meeting={item}
        index={index}
        testID={'RENDER_ITEM'}
        updateMeeting={this.updateMeeting}
        last={(this.props.requestedMeetings.length - 1)}
      />
    );
  };

  public separator = () => <View style={styles.itemSeparator} testID={'SEPARATOR_ITEM'}/>;

  private getMeetings = (isRefresh: boolean) => {
    const currentDateTime = DateHelper.getCurrentDateTime();
    const userProfile = this.props.profile;
    const limit = MeetingConstantsConfig.REQUESTED_MEETING_LIMIT;
    const page = 1;
    const {userEcosystemId} = this.props;
    if ( userProfile.profileId ) {
      this.props.getPendingMeetings(userProfile.profileId, currentDateTime, page, limit, userEcosystemId, isRefresh);
    }
  };

  private updateMeeting = (meetingId: string, status: string) => this.props.updateMeetingStatus(meetingId, status);

  private keyExtractor = (item: MeetingModel, index: number): string => item.getId() + `${index}`;
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRequestContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: TABBED_SECTION_VERTICAL_MARGIN,
    paddingVertical: TABBED_SECTION_VERTICAL_PADDING,
    backgroundColor: theme.colors.white,
  },
  separator: {
    marginHorizontal: theme.viewport.width * 0.04,
    backgroundColor: theme.colors.whiteTwo,
    borderBottomWidth: (viewport.width * 0.001),
  },
  headingStyle: {
    fontSize: 14,
    fontFamily: 'Avenir-Medium',
    color: theme.colors.warmGrey,
    letterSpacing: 0.09,
  },
  requestContainer: {
    paddingVertical: theme.viewport.height * 0.021,
    backgroundColor: theme.colors.lightPurple,
  },
  itemSeparator: {
    backgroundColor: 'transparent',
    width: (theme.viewport.width * 0.0186),
  },
  headerStyle: {
    marginBottom: viewport.width * 0.01,
    justifyContent: 'center',
    marginHorizontal: TABBED_SECTION_HEADER_HORIZONTAL_MARGIN,
  },
});
