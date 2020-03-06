import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { HeadingComponent } from '@components/HeadingComponent';
import { MeetingModel } from '@models/Meetings';
import { theme } from '@styles/theme';
import { connect } from 'react-redux';
import { getUpcomingMeetings } from '@modules/meetings/actions';
import { getLoading, getUpcomingMeetingsSelector } from '@modules/meetings/selectors';
import images from '@assets/images';
import { UpcomingMeetingsCard } from '@modules/meetings/components/UpcomingMeetingsCard';
import { DateHelper } from '@utils/DateHelper';
import { MeetingConstantsConfig } from '@constants/config';
import { MeetingConstants } from '@constants/shared';
import { IProfileState } from '@modules/profile/reducer';
import {
  TABBED_SECTION_CARD_HORIZONTAL_PADDING,
  TABBED_SECTION_HEADER_HORIZONTAL_MARGIN,
  TABBED_SECTION_HEADER_VERTICAL_PADDING,
  TABBED_SECTION_VERTICAL_MARGIN, TABBED_SECTION_VERTICAL_PADDING,
  viewport,
} from '@styles/viewport';
import { INavigation } from 'navigation';
import { getUserProfileEcosystem } from '@modules/profile/selectors';
import Lines from '@shimmer/components/Lines';
import { RouteNames } from '@navigation/routes';
import { getMeetingReload, isRefreshHome } from '@modules/root/selectors';

interface IProps {
  navigation: INavigation;
  profile: IProfileState;
  getUpcomingMeetings: (profileId: string, currentDateTime: Date,
                        status: string, limit: number, userEcosystemId: number) => void;
  isLoading: boolean;
  testID?: string;
  userEcosystemId: number;
  isRefreshHome: boolean;
  meetingReload: {reload: boolean, source: string};
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    getUpcomingMeetings: (profileId: string, currentDateTime: Date,
                          status: string, limit: number, userEcosystemId: number) => dispatch
    (getUpcomingMeetings(profileId, currentDateTime, status, limit, userEcosystemId)),
  };
};

export const mapStateToProps = (state: any) => {
  const ecosystem = getUserProfileEcosystem(state);
  return {
    upcomingMeetings: getUpcomingMeetingsSelector(state),
    profile: state.profile.userProfile,
    isLoading: getLoading(state),
    userEcosystemId: ecosystem && ecosystem.id,
    isRefreshHome: isRefreshHome(state),
    meetingReload: getMeetingReload(state),
  };
};

export class UpcomingMeetingsContainer extends Component<any, IProps> {

  public componentDidMount() {
    this.getMeetings();
  }

  public componentDidUpdate(prevProps: any): void {
    const prevProfile = prevProps.profile;
    const newProfile = this.props.profile;
    if ( (prevProfile.profileId === undefined && newProfile.profileId !== undefined)
      || (prevProps.isRefreshHome !== this.props.isRefreshHome && this.props.isRefreshHome ||
        (prevProps.meetingReload.reload !== this.props.meetingReload.reload && this.props.meetingReload)
      ) ) {
      this.getMeetings();
    }
  }

  public calendarIconOnPress = () => {
    this.props.navigation.navigate(RouteNames.calendar);
  };

  public render() {
    const {upcomingMeetings, isLoading} = this.props;
    return (
      <View style={styles.container}>
        <HeadingComponent
          headingStyles={styles.headingStyle}
          heading={MeetingConstants.CARD_HEADING}
          buttonIcon={images.calendarIcon}
          buttonStyle={styles.buttonStyle}
          headerStyles={styles.headerStyles}
          handleButton={this.calendarIconOnPress}
        />
        <View>
          <Text
            style={styles.titleUpcomingMeetings}
            testID={'UPCOMING_MEETINGS_TITLE_' + MeetingConstants.UPCOMING_MEETINGS}
          >
            {MeetingConstants.UPCOMING_MEETINGS}
          </Text>
          <FlatList
            data={upcomingMeetings}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={this.keyExtractor}
            ListEmptyComponent={this.renderLoader}
          />
        </View>
        {!isLoading && upcomingMeetings.length === 0 &&
        (
          <View style={styles.noUpcomingMeetings}>
            <Image
              source={images.noUpcomingMeetingIcon}
              style={styles.noUpcomingMeetingsIcon}
              testID={'NO_UPCOMING_MEETINGS_ICON_' + images.noUpcomingMeetingIcon}
            />
            <Text
              style={styles.titleNoUpcomingMeetings}
              testID={'NO_UPCOMING_MEETINGS_TITLE_' + MeetingConstants.NO_UPCOMING_MEETINGS}
            >
              {MeetingConstants.NO_UPCOMING_MEETINGS}
            </Text>
          </View>
        )
        }
      </View>
    );
  }

  public renderItem = ({item, index}: { item: MeetingModel, index: number }): React.ReactElement => {

    const goToMeetingDetails = () => this.showMeetingDetails(item.getId(), this.props.profile.profileId);

    return (
      <UpcomingMeetingsCard
        meetings={item}
        index={index}
        testID={'RENDER_ITEM'}
        onClick={goToMeetingDetails}
      />
    );
  };

  public renderSeparator = (): React.ReactElement => <View style={styles.separator} testID={'ITEM_SEPARATOR'}/>;

  public getMeetings = () => {
    const userProfile = this.props.profile;
    const currentDateTime = DateHelper.getCurrentDateTime();
    const status = MeetingConstantsConfig.status;
    const limit = MeetingConstantsConfig.UPCOMING_MEETINGS_LIMIT;
    if ( userProfile.profileId ) {
      this.props.getUpcomingMeetings(userProfile.profileId,
        currentDateTime, status, limit, this.props.userEcosystemId);
    }
  };
  public keyExtractor = (item: MeetingModel): string => item.getId();
  private showMeetingDetails = (meetingId: string, profileId: string) => {
    this.props.navigation.navigate('MeetingDetailsScreen', {meetingId, profileId});
  };

  private renderLoader = () => {
    if ( this.props.isLoading ) {
      return this.getShimmer();
    }
    return null;
  };

  private getShimmer = () =>
    (
      <View style={{backgroundColor: theme.colors.white}}>
        <View style={{flexDirection: 'row'}}>
          <Lines
            count={2}
            tag={'Meeting-Body'}
            line={{height: (viewport.height * 0.02), width: (viewport.width * 0.9 / 2), style: styles.shimmerLineStyle}}
            style={styles.bodyContainerStyle}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Lines
            count={2}
            tag={'Meeting-Body'}
            line={{height: (viewport.height * 0.02), width: (viewport.width * 0.9 / 2), style: styles.shimmerLineStyle}}
            style={styles.bodyContainerStyle}
          />
        </View>
      </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingMeetingsContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: TABBED_SECTION_VERTICAL_MARGIN,
    paddingVertical: TABBED_SECTION_VERTICAL_PADDING,
    backgroundColor: theme.colors.white,
  },
  headerStyles: {
    marginBottom: TABBED_SECTION_HEADER_VERTICAL_PADDING,
    marginHorizontal: TABBED_SECTION_HEADER_HORIZONTAL_MARGIN,
  },
  titleUpcomingMeetings: {
    fontSize: 14,
    letterSpacing: 0.09,
    color: theme.colors.warmGrey,
    fontFamily: 'OpenSans-Semibold',
    paddingHorizontal: theme.viewport.width * 0.05,
  },
  titleNoUpcomingMeetings: {
    fontSize: 14,
    letterSpacing: 0.09,
    color: theme.colors.warmGrey,
    fontFamily: 'OpenSans-Semibold',
    paddingHorizontal: theme.viewport.width * 0.05,
  },
  headingStyle: {
    fontFamily: 'Georgia-Bold',
    fontSize: 19,
    color: theme.colors.black,
    letterSpacing: 0.13,
  },
  separator: {
    marginTop: theme.viewport.height * 0.008,
    marginBottom: theme.viewport.height * 0.008,
  },
  buttonStyle: {
    height: 17,
    width: 19,
    marginRight: theme.viewport.width * 0.025,
  },
  noUpcomingMeetings: {
    flexDirection: 'row',
    paddingTop: 18,
    paddingHorizontal: theme.viewport.width * 0.05,
  },
  noUpcomingMeetingsIcon: {
    height: 31,
    width: 29,
    paddingRight: 12,
  },
  shimmerLineStyle: {
    marginLeft: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
    paddingVertical: viewport.width * 0.01,
  },
  bodyContainerStyle: {
    marginTop: viewport.width * 0.03,
  },
});
