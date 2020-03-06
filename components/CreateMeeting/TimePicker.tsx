import React, {Component} from 'react';
import {View, StyleSheet, Picker} from 'react-native';
import { theme } from '@styles/theme';

interface IProps {
  selectedHour: string;
  selectedHalf: string;
  selectedMins: string;
  onSelectHour: (value: string) => void;
  onSelectHalf: (value: string) => void;
  onSelectMins: (value: string) => void;
}

interface IState {
  hours: string[];
}

export default class TimePicker extends Component<IProps, IState> {
  public state = {
    hours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  };

  public render(): React.ReactNode {
    const {selectedHour, selectedHalf, selectedMins, onSelectMins} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.picker}>
          <Picker
            mode="dropdown"
            selectedValue={selectedHour}
            onValueChange={this.props.onSelectHour}
            style={{width: theme.viewport.width * 0.28}}
          >
            {
              this.state.hours.map((hour: string) => <Picker.Item
                label={hour}
                value={hour}
                key={hour}
              />)
            }
          </Picker>
        </View>
        <View style={styles.picker}>
          <Picker
            mode="dropdown"
            selectedValue={selectedMins}
            onValueChange={onSelectMins}
            style={{width: theme.viewport.width * 0.28}}
          >
            <Picker.Item label="00" value="00"/>
            <Picker.Item label="30" value="30"/>
          </Picker>
        </View>
        <View style={styles.picker}>
          <Picker
            mode="dropdown"
            selectedValue={selectedHalf}
            onValueChange={this.props.onSelectHalf}
            style={{width: theme.viewport.width * 0.28}}
          >
            <Picker.Item label="AM" value="AM"/>
            <Picker.Item label="PM" value="PM"/>
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: theme.viewport.width * 0.28,
  },
});
