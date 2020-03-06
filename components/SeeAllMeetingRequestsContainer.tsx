import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { theme } from '@styles/theme';
import { connect } from 'react-redux';
import { fetchPendingMeetings, isInitialCall, updateMeetingStatus } from '@modules/meetings/actions';
import {
  getPendingMeetingsLoading, getMeetingRequests, getIsLastPageReached,
  getSeeAllDataLoading,
} from '@modules/meetings/selectors';
import { LoadingStateComponent } from '@components/LoadingStateComponent';
import { IProfileState } from '@modules/profile/reducer';
import { SeeAllMeetingRequestsCard } from '@modules/meetings/components/SeeAllMeetingRequestsCard';
import { MeetingModel } from '@models/Meetings';
import { DateHelper } from '@utils/DateHelper';
import { TABBED_SECTION_CARD_HORIZONTAL_PADDING, viewport } from '@styles/viewport';
import { Shimmer } from '@shimmer/constants';
import VerticalList from '@shimmer/components/VerticalList';
import { getUserProfileEcosystem } from '@modules/profile/selectors';

interface IProps {
  navigation?: {
    goBack: () => void;
  };
  profile: IProfileState;
  isInitialCall: () => void;
  isLoading: boolean;
  isLastPage: boolean;
  seeAllDataLoading: boolean;
  updateMeetingStatus: (meetingId: string, status: string) => void;
  getMeetingRequestsList: (profileId: string, currentDateTime: Date,
                           page: number, limit: number, userEcosystemId: number) => void;
  requestedMeetings: any;
  userEcosystemId: number;
}

interface IState {
  page_number: number;
  page_limit: number;
  initial_data_loading: boolean;
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    getMeetingRequestsList:
      (profileId: string, currentDateTime: Date, page: number, limit: number, userEcosystemId: number) =>
        dispatch(fetchPendingMeetings(profileId, currentDateTime, page, limit, userEcosystemId)),
    isInitialCall: () => dispatch(isInitialCall()),
    updateMeetingStatus: (meetingId: string, status: string) =>
      dispatch(updateMeetingStatus(meetingId, status)),
  };
};

export const mapStateToProps = (state: any) => {
  const ecosystem = getUserProfileEcosystem(state);
  return {
    requestedMeetings: getMeetingRequests(state),
    isLoading: getPendingMeetingsLoading(state),
    isLastPage: getIsLastPageReached(state),
    seeAllDataLoading: getSeeAllDataLoading(state),
    profile: state.profile.userProfile,
    userEcosystemId: ecosystem && ecosystem.id,
  };
};

export class SeeAllMeetingRequestsContainer extends Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      page_number: 1,
      page_limit: 10,
      initial_data_loading: true,
    };
  }

  public componentDidMount() {
    this.props.isInitialCall();
    this.getMeetingRequests();
  }

  public render() {
    const {isLoading, requestedMeetings} = this.props;
    if (isLoading && this.state.initial_data_loading) {
      return this.getShimmer();
    } else if (requestedMeetings.length === 0) {
      return null;
    }
    return (
      <FlatList
        data={requestedMeetings}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
        scrollEnabled={true}
        onEndReached={this.onEndReachedHandler}
        onEndReachedThreshold={0.1}
        ListFooterComponent={this.renderLoader}
        contentContainerStyle={{paddingBottom: theme.viewport.height * 0.2}}
      />
    );
  }

  public onEndReachedHandler = () => {
    const currentDateTime = DateHelper.getCurrentDateTime();
    const userProfile = this.props.profile;
    if (!this.props.isLastPage) {
      this.setState((prev) =>
        ({page_number: prev.page_number + 1, initial_data_loading: false}), () => {
        this.props.getMeetingRequestsList(userProfile.profileId, currentDateTime,
          this.state.page_number, this.state.page_limit, this.props.userEcosystemId);
      });
    }
  }

  public renderItem = ({item, index}: { item: MeetingModel, index: number }): React.ReactElement => {
    return (
      <SeeAllMeetingRequestsCard
        meeting={item}
        index={index}
        updateMeeting={this.updateMeeting}
        testID={'SEE_ALL_MEETING_REQUESTS'}
        profile={this.props.profile}
      />
    );
  }

  public renderSeparator = (): React.ReactElement => <View style={styles.separator} testID={'ITEM_SEPARATOR'}/>;

  private getShimmer = () =>
    (
      <VerticalList
        autoRun={true}
        lines={1}
        items={5}
        tag={'sl'}
        isCircle={true}
        itemStyle={styles.shimmerItem}
        imageHolderValues={{...Shimmer.PROFILE_ROUNDED_ICON, style: styles.shimmerImageHolder}}
        lineValues={{height: 10, width: 250}}
        listStyle={{...styles.listContainer, ...styles.shimmerList}}
      />
    )

  private updateMeeting = (meetingId: string, status: string) =>
    this.props.updateMeetingStatus(meetingId, status)

  private renderLoader = () => {
    if (!this.props.seeAllDataLoading) {
      return null;
    } else {
      return (
        <View style={styles.loaderContainer} testID={'LIST_FOOTER'}>
          <LoadingStateComponent/>
        </View>
      );
    }
  }

  private getMeetingRequests = () => {
    const currentDateTime = DateHelper.getCurrentDateTime();
    const userProfile = this.props.profile;
    if (userProfile.profileId) {
      this.props.getMeetingRequestsList(userProfile.profileId, currentDateTime,
        this.state.page_number, this.state.page_limit, this.props.userEcosystemId);
    }
  }

  private keyExtractor = (item: MeetingModel, index: number): string => `${index}`;
}

export default connect(mapStateToProps, mapDispatchToProps)(SeeAllMeetingRequestsContainer);

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: viewport.width * 0.05,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    minHeight: 200,
    marginTop: '2%',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.whiteThree,
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  shimmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.viewport.height * 0.02,
  },
  shimmerList: {
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
  },
  shimmerImageHolder: {
    marginRight: viewport.width * 0.02,
  },
  listContainer: {
    paddingHorizontal: TABBED_SECTION_CARD_HORIZONTAL_PADDING,
  },
});
