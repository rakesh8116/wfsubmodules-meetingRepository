import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '@styles/theme';

interface IProps {
  location: string;
  setLocation: (location: string) => void;
  expand: boolean;
  closeFlag: () => void;
}

interface IState {
  optionsVisibility: boolean;
}

export default class Location extends Component<IProps> {
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
    const {location, setLocation} = this.props;

    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={this.handleEditLocation}
          testID={'LOCATION_TEXT_CONTAINER'}
          accessibilityLabel={'LOCATION_TEXT_CONTAINER'}
        >
          <Icon name="location-on" style={{fontSize: 30, color: 'orange'}}/>
          <View style={styles.locationContainer}>
            <Text
              style={styles.locationText}
              testID={'LOCATION_TEXT'}
              accessibilityLabel={'LOCATION_TEXT'}
            >
              Location
            </Text>
            <Text
              style={styles.location}
              testID={'MEETING_LOCATION'}
              accessibilityLabel={'MEETING_LOCATION'}
            >
              {location}
            </Text>
          </View>
        </TouchableOpacity>
        {
          this.state.optionsVisibility &&
          <View style={styles.optionContainer}>
              <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => this.props.setLocation('Zoom Call')}
                  testID={'ZOOM_TEXT'}
                  accessibilityLabel={'ZOOM_TEXT'}
              >
                  <Text style={styles.itemText}>Zoom Call</Text>
                {
                  location === 'Zoom Call' &&
                  <Icon2 name="check" style={{fontSize: 25}}/>
                }
              </TouchableOpacity>
              <View style={styles.separator}/>
              <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => setLocation('In Person')}
                  testID={'IN_PERSON_TEXT_CONTAINER'}
                  accessibilityLabel={'IN_PERSON_TEXT_CONTAINER'}
              >
                  <Text
                    style={styles.itemText}
                    testID={'IN_PERSON_TEXT'}
                    accessibilityLabel={'IN_PERSON_TEXT'}
                  >
                    In Person
                  </Text>
                {
                  this.props.location === 'In Person' &&
                  <Icon2 name="check" style={{fontSize: 25}}/>
                }
              </TouchableOpacity>
          </View>
        }
      </View>
    );
  }

  private handleEditLocation = () => {
    this.props.closeFlag();
    this.setState((state: IState) => ({optionsVisibility: !state.optionsVisibility}))
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.viewport.width * 0.075,
    paddingVertical: theme.viewport.width * 0.065,
    flexDirection: 'row',
  },
  locationContainer: {
    paddingLeft: theme.viewport.width * 0.075,
  },
  locationText: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: '#4a4a4a',
    fontSize: 13,
    lineHeight: 18,
  },
  location: {
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
    paddingLeft: theme.viewport.width * 0.075,
  },
  separator: {
    paddingVertical: theme.viewport.height * 0.025,
  },
});
