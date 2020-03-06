import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileModel } from '@models/Profile';
import moment from 'moment';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import MeetingDuration from '@modules/meetings/components/CreateMeeting/MeetingDuration';
import AboutMeeting from '@modules/meetings/components/CreateMeeting/AboutMeeting';
import AddPeople from '@modules/meetings/components/CreateMeeting/AddPeople';
import DateTimePicker from '@modules/meetings/components/CreateMeeting/DateTimePicker';
import Location from '@modules/meetings/components/CreateMeeting/Location';
import CreateMeetingHeader from '@components/CreateMeetingHeader';
import { createMeeting, ICreateMeeting } from '@modules/meetings/actions';
import { getIsMeetingCreated } from '@modules/meetings/selectors';
import { Toast } from '@components/Toast';
import { INavigation } from 'navigation';
import { LANG_ENGLISH } from '@translations/index';

interface IProps {
  navigation: INavigation;
  createMeeting: (profileId: string, meetingData: ICreateMeeting) => void;
  profileId: string;
  isMeetingCreated: { status: string, message: string };
}

interface IState {
  title: string;
  meetingDate: any;
  duration: string;
  recipient: ProfileModel;
  location: string;
  aboutMeeting: string;
  dateTimeIsExpanded: boolean;
  meetingDurationIsExpanded: boolean;
  locationIsExpanded: boolean;
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    createMeeting: (profileId: string, meetingData: ICreateMeeting) => dispatch(createMeeting(profileId, meetingData)),
  };
};

export const mapStateToProps = (state: any) => {
  return {
    profileId: state.profile.userProfile.profileId,
    isMeetingCreated: getIsMeetingCreated(state),
  };
};

export class CreateMeetingContainer extends Component<IProps, IState> {

  public state: IState = {
    title: '',
    meetingDate: moment(moment().add(30 - (moment().minutes() % 30), 'minutes')
      .format('dddd, D MMM h : mm A'), 'dddd, D MMM h : mm A')
      .toISOString(),
    duration: '30',
    recipient: {} as ProfileModel,
    location: 'Zoom Call',
    aboutMeeting: '',
    dateTimeIsExpanded: false,
    meetingDurationIsExpanded: false,
    locationIsExpanded: false,
  };

  public componentDidMount() {
    const defaultDate = this.props.navigation.getParam('date');

    this.setState((state: IState) => ({
      recipient: this.props.navigation.getParam('recipient') ?
        this.props.navigation.getParam('recipient') : {} as ProfileModel,
      meetingDate: defaultDate ? defaultDate : state.meetingDate,
    }));
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.isMeetingCreated.status === '') {
      if (this.props.isMeetingCreated.status === 'SUCCESS') {
        this.props.navigation.goBack();
        Toast.info({title: this.props.isMeetingCreated.message, duration: 3000});
      }
      if (this.props.isMeetingCreated.status === 'FAILURE') {
        Toast.info({title: this.props.isMeetingCreated.message, duration: 3000});
      }
    }
  }

  public render() {
    const {title, duration, location, recipient, meetingDate} = this.state;
    const dateClosed = () => this.closeOtherComponent('date');
    const durationClosed = () => this.closeOtherComponent('duration');
    const addPeopleClosed = () => this.closeOtherComponent('addPeople');
    const locationClosed = () => this.closeOtherComponent('location');

    return (
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
      >
        <View>
          <CreateMeetingHeader
            title={title}
            onTextChange={this.setTitle}
            onBackArrow={this.handleOnPressBack}
            onSave={this.handleSave}
            isSaveEnabled={true}
            placeHolderText="Enter Title"
            autoFocus={true}
          />
        </View>
        <View>
          {
            '' !== meetingDate &&
            <DateTimePicker
              setMeetingDate={this.setMeetingDate}
              meetingDate={meetingDate}
              expand={this.state.dateTimeIsExpanded}
              closeFlag={dateClosed}
            />
          }
          <View style={styles.separator}/>
          <MeetingDuration
            duration={duration}
            setDuration={this.setDuration}
            expand={this.state.meetingDurationIsExpanded}
            closeFlag={durationClosed}
          />
          <View style={styles.separator}/>
          <AddPeople
            navigation={this.props.navigation}
            recipient={recipient}
            setRecipient={this.setRecipient}
            closeFlag={addPeopleClosed}
          />
          <View style={styles.separator}/>
          <Location
            location={location}
            setLocation={this.setLocation}
            expand={this.state.locationIsExpanded}
            closeFlag={locationClosed}
          />
          <View style={styles.separator}/>
          <AboutMeeting setAboutMeeting={this.setAboutMeeting}/>
        </View>
      </ScrollView>
    );
  }

  private closeOtherComponent = (from: string) => {
    if (from === 'date') {
      this.setState({
        meetingDurationIsExpanded: false,
        locationIsExpanded: false,
      });
    } else if (from === 'duration') {
      this.setState({
        dateTimeIsExpanded: false,
        locationIsExpanded: false,
      });
    } else if (from === 'addPeople') {
      this.setState({
        dateTimeIsExpanded: false,
        meetingDurationIsExpanded: false,
        locationIsExpanded: false,
      });
    } else if (from === 'location') {
      this.setState({
        dateTimeIsExpanded: false,
        meetingDurationIsExpanded: false,
      });
    }
  };

  private handleOnPressBack = () => this.props.navigation.goBack();

  private setTitle = (text: string) =>
    this.setState({title: text});

  private setMeetingDate = (date: string) =>
    this.setState({meetingDate: date});

  private setDuration = (duration: string) =>
    this.setState({duration});

  private setRecipient = (profile: ProfileModel) =>
    this.setState({recipient: profile});

  private setLocation = (location: string) =>
    this.setState({location});

  private setAboutMeeting = (details: string) =>
    this.setState({aboutMeeting: details});

  private handleSave = () => {
    if (this.isAnyError()) {
      return;
    }
    const {title, recipient, location, duration, aboutMeeting, meetingDate} = this.state;
    let meetingType = '';
    let endMeetingDate = '';
    if ('Zoom Call' === location) {
      meetingType = 'zoom';
    } else if ('In Person' === location) {
      meetingType = 'Face to Face';
    }
    if (duration) {
      endMeetingDate = moment(meetingDate).add(moment.duration({minutes: parseInt(duration, 10)})).toISOString();
    }
    const meetingData: ICreateMeeting = {
      title,
      requestedTo: recipient.getProfileId(),
      type: meetingType,
      startDateTime: meetingDate,
      endDateTime: endMeetingDate,
      summary: aboutMeeting,
    };
    this.props.createMeeting(this.props.profileId, meetingData);
  };

  private isAnyError = () => {
    const {recipient, title} = this.state;

    if (title.trim() === '') {
      Alert.alert('', LANG_ENGLISH.Meeting.ERROR_MEETING_TITLE);
      return true;
    } else if (Object.entries(recipient).length === 0) {
      Alert.alert('', LANG_ENGLISH.Meeting.ERROR_MEETING_RECIPIENT);
      return true;
    }

    return false;
  };

}

const styles = StyleSheet.create({
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#979797',
    opacity: 0.2,
    justifyContent: 'center',
  },
  backIconStyle: {
    color: 'black',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetingContainer);
