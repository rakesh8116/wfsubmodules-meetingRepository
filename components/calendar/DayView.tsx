import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {MeetingModel} from '@models/Meetings';
import {INavigation} from 'navigation';
import {RouteNames} from '@navigation/routes';
import {colors} from '@styles/colors';

const LEFT_MARGIN = 60 - 1;
const CALENDER_HEIGHT = 2400;
const TEXT_LINE_HEIGHT = 17;

interface IProps {
  date: Date;
  index: number;
  format24h: boolean;
  events: MeetingModel[];
  width: number;
  styles: any;
  selectedDate: Date;
  navigation: INavigation;
  eventTapped: (event: MeetingModel) => void;
  start: number;
  end: number;
}

function range(from: number, to: number) {
  // tslint:disable-next-line:no-shadowed-variable
  return Array.from(Array(to), ( _, i) => from + i);
}

export default class DayView extends React.PureComponent<IProps, any> {
  private calendarHeight: number;
  constructor(props: any) {
    super(props);
    this.calendarHeight = (props.end - props.start) * 100;
    const width = props.width - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, props.start);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) -
      this.calendarHeight / (props.end - props.start);
    initPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: initPosition,
      packedEvents,
    };
  }

  public componentWillReceiveProps(nextProps: any) {
    const width = nextProps.width - LEFT_MARGIN;
    this.setState({
      packedEvents: populateEvents(nextProps.events, width, nextProps.start),
    });
  }

  public renderLines() {
    const {format24h, start, end} = this.props;
    const offset = this.calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = `12 AM`;
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? `12 AM` : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }
      const {width, styles} = this.props;
      const onPressOneHour = () => onPressCreateMeeting(0);
      const onPressHalfHour = () => onPressCreateMeeting(30);
      const onPressCreateMeeting = (min: number) => {
        if (i !== 24) {
        const SelectedDate: Date = this.props.selectedDate;
        SelectedDate.setHours(i, min, 0, 0);
        this.props.navigation.navigate(RouteNames.createMeeting, {
          date: new Date(SelectedDate).toISOString()});
        }
      };
      return [
          <Text
            key={`timeLabel${i}`}
            style={[styles.timeLabel, {top: offset * index - 6}]}
          >
            {timeText}
          </Text>,
          <TouchableOpacity
            key={`line${i}`}
            onPress={onPressOneHour}
            style={[styles.line, {top: offset * index, width: width - 20}]}
          />,
          <TouchableOpacity
            key={`lineHalf${i}`}
            onPress={onPressHalfHour}
            style={[
              styles.line,
              {top: offset * (index + 0.5), width: width - 20},
            ]}
          />,
      ];
    });
  }

  public onEventTapped(event: MeetingModel) {
    this.props.eventTapped(event);
  }

  public renderEvents() {
    const {styles} = this.props;
    const {packedEvents} = this.state;
    const events: any = packedEvents.map((event: any, i: number) => {
      let edgeCaseFlag = moment(event.scheduled.startDateTime).format('YYYY-MM-DD') !==
        moment(this.props.selectedDate).format('YYYY-MM-DD');
      edgeCaseFlag = edgeCaseFlag && event.top === 2350;
      const style = {
        left: event.left,
        height: edgeCaseFlag ? 49 : event.height,
        width: event.width,
        top: edgeCaseFlag ? 0 : event.top,
      };

      const eventColor = {
        backgroundColor: colors.calendarGrey,
      };
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const onEventPress = () => this.onEventTapped(this.props.events[event.index]);
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onEventPress}
          key={i}
          testID={'Events'}
          accessibilityLabel={'Events'}
          style={[styles.event, style, colors.calendarGrey && eventColor]}
        >
          <View>
            <Text numberOfLines={1} style={styles.eventTitle}>
              {event.profile.getName() || 'Event'}
            </Text>
            {numberOfLines > 1 ? (
              <Text
                numberOfLines={numberOfLines - 1}
                style={[styles.eventSummary]}
              >
                {event.title || ' '}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={{marginLeft: LEFT_MARGIN}}>{events}</View>
      </View>
    );
  }

  public render() {
    const {styles} = this.props;
    return (
      <ScrollView
        contentContainerStyle={[
          styles.contentStyle,
          {width: this.props.width},
        ]}
      >
        {this.renderLines()}
        {this.renderEvents()}
      </ScrollView>
    );
  }
}
