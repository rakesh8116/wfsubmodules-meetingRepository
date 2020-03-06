import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '@styles/colors';
import {viewport} from '@styles/viewport';

interface IProps {
  header: string;
  pressPage: () => void;
  pressGoBack: () => void;
  handleAddMeeting: () => void;
}

export default function CalendarHeader(props: IProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.goBack}
          onPress={props.pressGoBack}
          testID={'BACK_BUTTON'}
          accessibilityLabel={'BACK_BUTTON'}
        >
          <Icon name="arrow-left" size={viewport.height * 0.035} color={colors.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerBody}>
        <Text style={styles.headerText}>{props.header}</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.goBack}
          onPress={props.handleAddMeeting}
          testID={'PLUS_ICON'}
          accessibilityLabel={'PLUS_ICON'}
        >
          <Icon name="plus" size={viewport.height * 0.035} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  headerBody: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: 'Georgia-Bold',
    fontSize: 19,
    color: colors.black,
  },
  headerBack: {
    color: colors.black,
    fontSize: viewport.height * 0.035,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerPlusIcon: {
    fontSize: viewport.height * 0.035,
    marginRight: viewport.height * 0.01,
  },
  headerPageIcon: {
    fontSize: viewport.height * 0.035,
  },
  headerBodyView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goBack: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    marginLeft: viewport.width * 0.05,
  },
});
