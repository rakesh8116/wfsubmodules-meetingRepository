import {
  takeEvery,
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { MeetingsRepository } from '@repositories/MeetingsRepository';
import {
  updateMeetingStatusFailure,
  updateMeetingStatusSuccess,
  fetchPendingMeetingsFailure,
  fetchPendingMeetingsSuccess,
  getUpcomingMeetingsSuccess,
  getUpcomingMeetingsFailure,
  getMeetingDetailsSuccess,
  getMeetingDetailsFailure,
  MeetingActions,
  isLastMeetingRequestPage,
  IGetUpcomingMeetingsByDateParams,
  getUpcomingMeetingsByDateSuccess,
  getUpcomingMeetingsByDateFailure,
  ICreateMeeting,
  createMeetingSuccess,
  createMeetingFailure,
} from '@modules/meetings/actions';
import { MeetingModel } from '@models/Meetings';
import { fetchProfiles } from '@modules/profile/actions';
import { MeetingConstantsConfig, meetingStatusType } from '@constants/config';
import { homeContainerRefreshed, reloadMeetingData } from '@modules/root/actions';
import { Toast } from '@components/Toast';
import { LANG_ENGLISH } from '@translations/index';
import {
  ERR_MEETING_EXIST,
  ERR_MEETING_REQUEST_SENT,
  ERR_PAST_TIMESTAMP,
} from '@network/constants';
import { IApiClientErrorDetails } from '@network/apiClientError';
import { ProfileRepository } from '@repositories/ProfileRepository';

// TODO
// pending and upcoming meeting's saga and action can be same

const parseError = (error: IApiClientErrorDetails): string => {
  let errorMessage = LANG_ENGLISH.Meeting.GENERIC_ERROR_MESSAGE;
  if ( error ) {
    if ( error.code === ERR_MEETING_REQUEST_SENT ) {
      errorMessage = LANG_ENGLISH.Meeting.ERR_MEETING_REQUEST_SENT;
    } else if ( error.code === ERR_MEETING_EXIST ) {
      errorMessage = LANG_ENGLISH.Meeting.ERR_MEETING_EXIST;
    } else if (error.code === ERR_PAST_TIMESTAMP) {
      errorMessage = LANG_ENGLISH.Meeting.ERR_PAST_TIMESTAMP;
    }
  }
  return errorMessage;
};

export interface IPendingMeetingAction {
  type: string;
  payload: {
    profileId: string;
    currentDateTime: Date;
    page: number;
    limit: number;
    userEcosystemId: number;
  };
}

export interface IUpdateMeetingStatusAction {
  type: string;
  payload: {
    meetingId: string;
    status: string;
  };
}

interface IUpcomingMeetingAction {
  type: string;
  payload: {
    profileId: string;
    currentDateTime: Date;
    status: string;
    limit: number;
    userEcosystemId: number;
  };
}

interface IUpcomingMeetingByDateAction {
  type: string;
  payload: IGetUpcomingMeetingsByDateParams;
}

interface IMeetingsDetailAction {
  type: string;
  payload: {
    userProfileId: string;
    meetingId: string;
    userEcosystemId: number;
  };
}

interface ICreateMeetingAction {
  type: string;
  payload: {
    profileId: string,
    meetingData: ICreateMeeting,
  };
}

export function* fetchPendingMeetingsSaga(action: IPendingMeetingAction) {
  try {
    const pendingMeetings =
      yield call(MeetingsRepository.getMeetings, {...action.payload, status: meetingStatusType.Requested});
    const profileIds = pendingMeetings.map((meeting: MeetingModel) => {
      if (meeting.getRequestedBy() === action.payload.profileId) {
        return meeting.getRequestedTo();
      } else {
        return meeting.getRequestedBy();
      }
    });
    if (pendingMeetings.length === 0) {
      yield put(isLastMeetingRequestPage(true));
    }
    yield put(fetchProfiles(profileIds, 'profiles'));
    yield put(fetchPendingMeetingsSuccess(pendingMeetings));
    yield put(homeContainerRefreshed());
  } catch (e) {
    yield put(fetchPendingMeetingsFailure(e.message));
    yield put(homeContainerRefreshed());
  }
}

export function* updateMeetingStatusSaga(action: IUpdateMeetingStatusAction) {
  try {
    const response = yield call(MeetingsRepository.updateMeetingStatus, action.payload);
    yield put(getMeetingDetailsSuccess(response));
    yield put(updateMeetingStatusSuccess((response._id)));
    if (response.status === MeetingConstantsConfig.STATUS_ACCEPTED) {
      Toast.info({title: LANG_ENGLISH.SUCCESS_MESSAGES.MEETING_ACCEPTED, duration: 3000});
    } else if (response.status === MeetingConstantsConfig.STATUS_REJECTED) {
      Toast.info({title: LANG_ENGLISH.SUCCESS_MESSAGES.MEETING_REJECTED, duration: 3000});
    }
    yield put(reloadMeetingData(true, 'saga'));
  } catch (e) {
    if (e.message === 'You have a meeting at this time') {
      Toast.info({title: LANG_ENGLISH.SUCCESS_MESSAGES.MEETING_CONFLICT, duration: 3000});
    } else if (e.message === 'Invalid timestamp') {
      Toast.info({title: LANG_ENGLISH.SUCCESS_MESSAGES.MEETING_STARTED, duration: 3000});
    }
    yield put(updateMeetingStatusFailure(e.message));
  }
}

export function* getUpcomingMeetingSaga(action: IUpcomingMeetingAction) {
  try {
    const contentResponse: MeetingModel[] = yield call(MeetingsRepository.getMeetings, action.payload);
    yield put(getUpcomingMeetingsSuccess(contentResponse));
    yield put(homeContainerRefreshed());
    yield put(reloadMeetingData(false, 'saga'));
  } catch (e) {
    yield put(getUpcomingMeetingsFailure(e.message));
    yield put(homeContainerRefreshed());
    yield put(reloadMeetingData(false, 'saga'));
  }
}

export function* getMeetingDetailsSaga(action: IMeetingsDetailAction) {
  try {
    const meetingResponse: MeetingModel  = yield call(MeetingsRepository.getMeetingDetails, action.payload);
    let profileId = '';
    if (meetingResponse.getRequestedBy() === action.payload.userProfileId) {
      profileId = meetingResponse.getRequestedTo();
    } else {
      profileId = meetingResponse.getRequestedBy();
    }
    const profiles = yield call(ProfileRepository.getProfiles, [profileId], 'profiles');
    meetingResponse.setProfile(profiles[0]);
    yield put(getMeetingDetailsSuccess(meetingResponse));
  } catch (e) {
    yield put(getMeetingDetailsFailure(e.message));
  }
}

export function* getUpcomingMeetingByDateSaga(action: IUpcomingMeetingByDateAction) {
  try {
    const contentResponse: MeetingModel[] = yield call(MeetingsRepository.getMeetingsByDate, action.payload);
    const profileIds = contentResponse.map((meeting: MeetingModel) => {
      if (meeting.getRequestedBy() === action.payload.profileId) {
        return meeting.getRequestedTo();
      } else {
        return meeting.getRequestedBy();
      }
    });
    yield put(fetchProfiles(profileIds, 'profiles'));
    yield put(getUpcomingMeetingsByDateSuccess(contentResponse));
    yield put(reloadMeetingData(false, 'saga'));
  } catch (e) {
    yield put(getUpcomingMeetingsByDateFailure(e.message));
    yield put(reloadMeetingData(false, 'saga'));
  }
}

export function* createMeetingSaga(action: ICreateMeetingAction) {
  try {
    const meetingResponse: any = yield call(MeetingsRepository.createMeeting, action.payload);
    yield put(createMeetingSuccess(meetingResponse));
    yield put(reloadMeetingData(true, 'saga'));
  } catch (e) {
    const error = parseError(e.details);
    yield put(createMeetingFailure(error));
  }
}

export function* watchMeetings() {
  yield takeEvery(MeetingActions.FETCH_PENDING, fetchPendingMeetingsSaga);
  yield takeEvery(MeetingActions.UPDATE_STATUS, updateMeetingStatusSaga);
  yield takeLatest(MeetingActions.FETCH_UPCOMING, getUpcomingMeetingSaga);
  yield takeLatest(MeetingActions.FETCH_MEETINGDETAILS, getMeetingDetailsSaga);
  yield takeEvery(MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE, getUpcomingMeetingByDateSaga);
  yield takeLatest(MeetingActions.CREATE_MEETING, createMeetingSaga);
}
