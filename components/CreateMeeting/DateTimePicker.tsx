import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import NativeDateTimePicker from 'react-native-modal-datetime-picker';
import TimePicker from './TimePicker';
import { theme } from '@styles/theme';

interface IProps {
  setMeetingDate: (meetingDate: string) => void;
  meetingDate: string;
  expand: boolean;
  closeFlag: () => void;
}

interface IState {
  isVisible: boolean;
  mode: string | undefined;
  selectedDate: moment.Moment;
  meetingDate: string;
  meetingTime: string;
  showTimePicker: boolean;
  selectedHour: string;
  selectedHalf: string;
  selectedMins: string;
}

export default class DateTimePicker extends Component<IProps, IState> {
  public state = {
    isVisible: false,
    mode: undefined,
    selectedDate: moment(),
    meetingDate: moment(this.props.meetingDate).format('dddd, D MMM YYYY'),
    meetingTime: moment(this.props.meetingDate).format('h : mm A'),
    showTimePicker: this.props.expand,
    selectedHour: moment(this.props.meetingDate).format('hh'),
    selectedHalf: moment(this.props.meetingDate).format('A'),
    selectedMins: moment(this.props.meetingDate).format('mm'),
  };

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.meetingDate !== this.props.meetingDate) {
      this.setState({
        meetingDate: moment(this.props.meetingDate).format('dddd, D MMM YYYY'),
        meetingTime: moment(this.props.meetingDate).format('h : mm A'),
        selectedHour: moment(this.props.meetingDate).format('hh'),
        selectedHalf: moment(this.props.meetingDate).format('A'),
        selectedMins: moment(this.props.meetingDate).format('mm'),
      });
    }
    if (prevState.showTimePicker !== this.props.expand) {
      this.setState({
        showTimePicker: this.props.expand,
      });
    }
  }

  public render(): React.ReactNode {
    const {meetingDate, meetingTime, selectedDate} = this.state;

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Icon name="calendar-range" style={{fontSize: 30, color: 'orange'}}/>
            <View style={{paddingLeft: theme.viewport.width * 0.075}}>
              <Text
                style={styles.date}
                onPress={this.openDatePicker}
                testID="date-picker-day-text"
                accessibilityLabel="date-picker-day-text"
              >
                {moment(meetingDate).format('dddd,')}
              </Text>
              <Text
                style={styles.date}
                onPress={this.openDatePicker}
                testID="date-picker-date-text"
                accessibilityLabel="date-picker-date-text"
              >
                {moment(meetingDate).format('D MMM YYYY')}
              </Text>
            </View>
          </View>
          <Text
            style={styles.time}
            onPress={this.openTimePicker}
            testID="time-picker-text"
            accessibilityLabel="time-picker-text"
          >
            {meetingTime}
          </Text>
        </View>
        {
          this.state.showTimePicker &&
          <View style={styles.optionContainer}>
              <TimePicker
                  selectedHour={this.state.selectedHour}
                  selectedHalf={this.state.selectedHalf}
                  selectedMins={this.state.selectedMins}
                  onSelectHour={this.onSelectHour}
                  onSelectHalf={this.onSelectHalf}
                  onSelectMins={this.onSelectMins}
              />
          </View>
        }
        <NativeDateTimePicker
          isVisible={this.state.isVisible}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          mode="date"
          minuteInterval={30}
          date={new Date(moment(meetingDate).toISOString())}
        />
      </View>
    );
  }

  private openDatePicker = () => {
    this.props.closeFlag();
    this.setState({
      mode: 'date',
      isVisible: true,
    });
  }

  private openTimePicker = () => this.setState((state: IState) => ({ showTimePicker: !state.showTimePicker }));

  private onSelectHour = (value: string) => this.setState({ selectedHour: value }, () => this.onTimeSelection());

  private onSelectHalf = (value: string) => this.setState({ selectedHalf: value }, () => this.onTimeSelection());

  private onSelectMins = (value: string) => this.setState({ selectedMins: value }, () => this.onTimeSelection());

  private onCancel = () => this.setState({ isVisible: false });

  private onTimeSelection = () =>
    this.setState((state: IState) =>
      ({ meetingTime: moment(`${state.selectedHour} : ${state.selectedMins} ${state.selectedHalf}`, 'h : mm A').format('h : mm A') }), () => {
      const {meetingDate, meetingTime} = this.state;

      this.props.setMeetingDate(moment(`${meetingDate} ${meetingTime}`, 'dddd, D MMM YYYY h : mm A').toISOString());
    })

  private onConfirm = (date: Date) => {
    this.setState((state: IState) => {
      const {meetingDate, mode} = state;

      return {
        isVisible: false,
        meetingDate: 'date' === mode ? moment(date).format('dddd, D MMM YYYY') : meetingDate,
        selectedDate: moment(date),
      };
    }, () => {
      const {meetingDate, meetingTime} = this.state;

      this.props.setMeetingDate(moment(`${meetingDate} ${meetingTime}`, 'dddd, D MMM YYYY h : mm A').toISOString());
    });
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
    flexDirection: 'row',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  date: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#131415',
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#131415',
  },
  optionContainer: {
    padding: theme.viewport.width * 0.050,
    backgroundColor: '#f5f5ff',
  },
});
