import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { viewport } from '@styles/viewport';
import { colors } from '@styles/colors';
import { connect } from 'react-redux';
import { getUserProfileEcosystem, getUserProfileId } from '@modules/profile/selectors';
import { getUpcomingMeetingsByDate, IGetUpcomingMeetingsByDateParams } from '@modules/meetings/actions';
import { getMeetingsDetailByDate } from '@modules/meetings/selectors';
import { MeetingModel } from '@models/Meetings';
import DayView from '@modules/meetings/components/calendar/DayView';
import { RouteNames } from '@navigation/routes';
import { INavigation } from 'navigation';
import { font } from '@styles/fonts/font';
import { getMeetingReload } from '@modules/root/selectors';

interface IProps {
  navigation: INavigation;
  setMonth: (date: Date) => void;
  profileId: string;
  getUpcomingMeetingsByDate: (params: IGetUpcomingMeetingsByDateParams) => void;
  ecosystemId: number;
  upcomingDetails: MeetingModel[];
  meetingReload: {reload: boolean, source: string};
}

interface IState {
  isLoading: boolean;
  start: Date;
  end: Date;
  selectedDate: Date;
}

export class CalendarContainer extends React.Component<IProps, IState> {

  public state = {
    isLoading: false,
    start: new Date(),
    end: new Date() ,
    selectedDate: new Date(),
  };

  public componentDidMount(): void {
    this.selectedDate(new Date());
  }

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    if ((prevProps.meetingReload.reload !== this.props.meetingReload.reload) && this.props.meetingReload) {
      this.selectedDate(this.state.selectedDate);
    }
  }

  public goBack = () => this.props.navigation.goBack();

  public selectedDate = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    this.setState({
      start,
      end,
      selectedDate: new Date(date),
    });
    this.getMeetingData(start, end);
  }

  public getMeetingData = (start: Date, end: Date) => {
    const params = {
      profileId: this.props.profileId,
      status: 'requested,accepted',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      userEcosystemId: this.props.ecosystemId,
    };
    this.props.getUpcomingMeetingsByDate(params);
  }

  public eventTapped = (event: MeetingModel) => {
    this.props.navigation.navigate(RouteNames.MeetingDetailsScreen, {
      meetingId: event.getId(),
      profileId: this.props.profileId,
      requestedTo: event.getRequestedTo(),
    });
  }

  public render() {
    return(
      <View style={styles.container}>
        <CalendarStrip
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{type: 'background', duration: 300, highlightColor: colors.black}}
          style={styles.calendar}
          minDate={new Date()}
          onWeekChanged={this.props.setMonth}
          showMonth={false}
          onDateSelected={this.selectedDate}
          calendarHeaderStyle={styles.calendarHeader}
          calendarColor={'#dddddd'}
          highlightDateNameStyle={styles.highlightDateNameStyle}
          highlightDateNumberStyle={styles.highlightDateNumberStyle}
          dateNumberStyle={styles.calendarDateNumberStyle}
          dateNameStyle={styles.calendarDateNameStyle}
          iconLeft={require('../../../../assets/img/left-arrow.png')}
          iconRight={require('../../../../assets/img/right-arrow.png')}
          iconContainer={styles.iconContainer}
        />
        <DayView
          date={new Date()}
          index={30}
          format24h={false}
          events={this.props.upcomingDetails}
          width={viewport.width}
          styles={dayViewStyles}
          selectedDate={this.state.selectedDate}
          navigation={this.props.navigation}
          eventTapped={this.eventTapped}
          start={0}
          end={24}
        />
      </View>
    );
  }
}

export const mapStateToProps = (state: any) => {
  const ecosystem = getUserProfileEcosystem(state);
  return {
    profileId: getUserProfileId(state),
    ecosystemId: ecosystem && ecosystem.id,
    upcomingDetails: getMeetingsDetailByDate(state),
    meetingReload: getMeetingReload(state),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return {
    getUpcomingMeetingsByDate: (params: IGetUpcomingMeetingsByDateParams) => dispatch
    (getUpcomingMeetingsByDate(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    backgroundColor: colors.calendarBgColor,
    height: viewport.height / 7,
    paddingTop: 20,
  },
  calendarHeader: {
    color: colors.black,
    marginBottom: 20,
  },
  calendarDateNumberStyle: {
    color: colors.black,
    fontFamily: font.OpenSans,
  },
  calendarDateNameStyle: {
    color: colors.black,
    fontFamily: font.OpenSans,
  },
  highlightDateNameStyle: {
    color: colors.white,
    fontFamily: font.OpenSans,
  },
  highlightDateNumberStyle: {
    color: colors.white,
    fontFamily: font.OpenSans,
  },
  iconContainer: {
    flex: 0.1,
  },
});

const dayViewStyles = StyleSheet.create({
  contentStyle: {
    backgroundColor: colors.white,
    height: 2500 + 20,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
  },
  arrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  arrowButton: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  event: {
    marginTop: 10,
    position: 'absolute',
    backgroundColor: colors.eventBgColor,
    opacity: 0.8,
    borderColor: colors.eventBorderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 4,
    minHeight: 25,
    flex: 1,
    paddingTop: 5,
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  eventTitle: {
    color: colors.lightViolet,
    fontWeight: '600',
    minHeight: 15,
  },
  eventSummary: {
    color: colors.lightViolet,
    fontSize: 12,
    flexWrap: 'wrap',
  },
  eventTimes: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.lightViolet,
    flexWrap: 'wrap',
  },
  line: {
    marginTop: 10,
    height: 50,
    position: 'absolute',
    left: 49,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  lineNow: {
    height: 1,
    position: 'absolute',
    left: 49,
    backgroundColor: 'red',
  },
  timeLabel: {
    marginTop: 10,
    position: 'absolute',
    left: 15,
    color: colors.grey,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    fontWeight: '500',
  },
});
