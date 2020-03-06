import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { theme } from '@styles/theme';

interface IProps {
  duration: string;
  setDuration: (duration: string) => void;
  expand: boolean;
  closeFlag: () => void;
}

interface IState {
  optionsVisibility: boolean;
}

export default class MeetingDuration extends Component<IProps, IState> {
  public state = {
    optionsVisibility: this.props.expand,
  };

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    if (prevState.optionsVisibility !== this.props.expand) {
      this.setState({
        optionsVisibility: this.props.expand,
      });
    }
  }

  public render(): React.ReactNode {
    const {duration, setDuration} = this.props;

    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={this.handleMinutesClick}
          testID={`CREATE_MEETING_DURATION_CONTAINER`}
          accessibilityLabel={`CREATE_MEETING_DURATION_CONTAINER`}
        >
          <Icon name="graph-pie" style={styles.iconStyle}/>
          <View style={styles.durationContainer}>
            <Text
              style={styles.durationText}
              testID={`CREATE_MEETING_DURATION_TEXT`}
              accessibilityLabel={`CREATE_MEETING_DURATION_TEXT`}
            >
              Duration
            </Text>
            <Text
              style={styles.duration}
              testID={`CREATE_MEETING_DURATION`}
              accessibilityLabel={`CREATE_MEETING_DURATION`}
            >
              {duration} Minutes
            </Text>
          </View>
        </TouchableOpacity>
        {
          this.state.optionsVisibility &&
          <View style={styles.optionContainer}>
              <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setDuration('30')}
                  testID={`CREATE_MEETING_DURATION_OPTION_CONTAINER_30`}
                  accessibilityLabel={`CREATE_MEETING_DURATION_OPTION_CONTAINER_30`}
              >
                  <Text
                    style={styles.itemText}
                    testID={`CREATE_MEETING_DURATION_OPTION_30`}
                    accessibilityLabel={`CREATE_MEETING_DURATION_OPTION_30`}
                  >
                    30 Minutes
                  </Text>
                {
                  duration === '30' &&
                  <Icon2 name="check" style={{fontSize: 25}}/>
                }
              </TouchableOpacity>
              <View style={styles.separator}/>
              <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setDuration('60')}
                  testID={`CREATE_MEETING_DURATION_OPTION_CONTAINER_60`}
                  accessibilityLabel={`CREATE_MEETING_DURATION_OPTION_CONTAINER_60`}
              >
                  <Text
                    style={styles.itemText}
                    testID={`CREATE_MEETING_DURATION_OPTION_60`}
                    accessibilityLabel={`CREATE_MEETING_DURATION_OPTION_60`}
                  >
                    60 Minutes
                  </Text>
                {
                  duration === '60' &&
                  <Icon2 name="check" style={{fontSize: 25}}/>
                }
              </TouchableOpacity>
          </View>
        }
      </View>
    );
  }

  private handleMinutesClick = () => {
    this.props.closeFlag();
    this.setState((state: IState) => ({optionsVisibility: !state.optionsVisibility}))
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
  },
  duration: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#131415',
  },
  optionContainer: {
    padding: theme.viewport.width * 0.05,
    backgroundColor: '#f5f5ff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#131415',
    paddingLeft: theme.viewport.width * 0.10,
  },
  separator: {
    paddingVertical: theme.viewport.height * 0.025,
  },
  durationContainer: {
    paddingLeft: theme.viewport.width * 0.085,
  },
  durationText: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: '#4a4a4a',
    fontSize: 13,
    lineHeight: 18,
  },
  iconStyle: {
    marginLeft: theme.viewport.width * 0.01,
    fontSize: 30,
    color: 'orange',
  },
});
