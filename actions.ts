import { IMeeting, MeetingModel } from '@models/Meetings';

const actionTypePrefix = 'MEETINGS';

export const MeetingActions = {
  FETCH_PENDING: `${actionTypePrefix}/FETCH_PENDING`,
  FETCH_PENDING_SUCCESS: `${actionTypePrefix}/FETCH_PENDING_SUCCESS`,
  FETCH_PENDING_FAILURE: `${actionTypePrefix}/FETCH_PENDING_FAILURE`,
  UPDATE_STATUS: `${actionTypePrefix}/UPDATE_MEETING_STATUS`,
  UPDATE_STATUS_SUCCESS: `${actionTypePrefix}/UPDATE_STATUS_SUCCESS`,
  UPDATE_STATUS_FAILURE: `${actionTypePrefix}/UPDATE_STATUS_FAILURE`,
  FETCH_UPCOMING: `${actionTypePrefix}/FETCH_UPCOMING`,
  FETCH_UPCOMING_SUCCESS: `${actionTypePrefix}/FETCH_UPCOMING_SUCCESS`,
  FETCH_UPCOMING_FAILURE: `${actionTypePrefix}/FETCH_UPCOMING_FAILURE`,
  IS_INITIAL_CALL: `${actionTypePrefix}IS_INITIAL_CALL`,
  IS_LAST_PAGE_REACHED: `${actionTypePrefix}IS_LAST_PAGE_REACHED`,
  FETCH_MEETINGDETAILS: `${actionTypePrefix}/FETCH_MEETINGDETAILS`,
  FETCH_MEETINGDETAILS_SUCCESS: `${actionTypePrefix}/FETCH_MEETINGDETAILS_SUCCESS`,
  FETCH_MEETINGDETAILS_FAILURE: `${actionTypePrefix}/FETCH_MEETINGDETAILS_FAILURE`,
  FETCH_UPCOMING_MEETINGS_BY_DATE: `${actionTypePrefix}/FETCH_UPCOMING_MEETINGS_BY_DATE`,
  FETCH_UPCOMING_MEETINGS_BY_DATE_SUCCESS: `${actionTypePrefix}/FETCH_UPCOMING_MEETINGS_BY_DATE_SUCCESS`,
  FETCH_UPCOMING_MEETINGS_BY_DATE_FAILURE: `${actionTypePrefix}/FETCH_UPCOMING_MEETINGS_BY_DATE_FAILURE`,
  CREATE_MEETING: `${actionTypePrefix}/CREATE_MEETING`,
  CREATE_MEETING_SUCCESS: `${actionTypePrefix}/CREATE_MEETING_SUCCESS`,
  CREATE_MEETING_FAILURE: `${actionTypePrefix}/CREATE_MEETING_FAILURE`,
};

interface IAction {
  profileId: string;
  currentDateTime: Date;
  limit: number;
  userEcosystemId: number;
  page?: number;
  status?: string;
  initialCall?: boolean;
  isRefresh?: boolean;
}

interface IDetailsAction {
  userProfileId: string;
  meetingId: string;
  userEcosystemId: number;
}

export interface IGetUpcomingMeetingsByDateParams {
  profileId: string;
  status: string;
  startTime: string;
  endTime: string;
  userEcosystemId: number;
}

export interface ICreateMeeting {
  requestedTo: string;
  type: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  summary?: string;
}

export const fetchPendingMeetings =
  (profileId: string, currentDateTime: Date, page: number, limit: number, userEcosystemId: number, isRefresh?: boolean):
    { type: string, payload: IAction } => {
    return {
      type: MeetingActions.FETCH_PENDING,
      payload: {
        profileId,
        currentDateTime,
        page,
        limit,
        userEcosystemId,
        isRefresh,
      },
    };
  };

export const fetchPendingMeetingsSuccess = (pendingMeetings: MeetingModel[]) => {
  return {
    type: MeetingActions.FETCH_PENDING_SUCCESS,
    payload: pendingMeetings,
  };
};

export const fetchPendingMeetingsFailure = (error: string) => {
  return {
    type: MeetingActions.FETCH_PENDING_FAILURE,
    payload: error,
  };
};

export const updateMeetingStatus = (meetingId: string, status: string) => {
  return {
    type: MeetingActions.UPDATE_STATUS,
    payload: {
      meetingId,
      status,
    },
  };
};

export const updateMeetingStatusSuccess = (meetingId: string) => {
  return {
    type: MeetingActions.UPDATE_STATUS_SUCCESS,
    payload: meetingId,
  };
};

export const updateMeetingStatusFailure = (error: string) => {
  return {
    type: MeetingActions.UPDATE_STATUS_FAILURE,
    payload: error,
  };
};

export const getUpcomingMeetings = (profileId: string, currentDateTime: Date,
                                    status: string, limit: number, userEcosystemId: number):
  { type: string, payload: IAction } => {
  return {
    type: MeetingActions.FETCH_UPCOMING,
    payload: {
      profileId,
      currentDateTime,
      status,
      limit,
      userEcosystemId,
    },
  };
};

export const getUpcomingMeetingsSuccess = (Meetings: MeetingModel[]) => {
  return {
    type: MeetingActions.FETCH_UPCOMING_SUCCESS,
    payload: Meetings,
  };
};

export const getUpcomingMeetingsFailure = (error: any): { type: string, payload: string } => {
  return {
    type: MeetingActions.FETCH_UPCOMING_FAILURE,
    payload: error,
  };
};

export const isLastMeetingRequestPage =
  (isLast: boolean): { type: string, payload: boolean } => {
    return {
      type: MeetingActions.IS_LAST_PAGE_REACHED,
      payload: isLast,
    };
  };

export const isInitialCall = (): { type: string, payload: MeetingModel[] } => {
  return {
    type: MeetingActions.IS_INITIAL_CALL,
    payload: [],
  };
};

export const getMeetingDetails = (userProfileId: string, meetingId: string, userEcosystemId: number):
  { type: string, payload: IDetailsAction } => {
  return {
    type: MeetingActions.FETCH_MEETINGDETAILS,
    payload: {
      userProfileId,
      meetingId,
      userEcosystemId,
    },
  };
};

export const getMeetingDetailsSuccess = (meeting: MeetingModel) => {
  return {
    type: MeetingActions.FETCH_MEETINGDETAILS_SUCCESS,
    payload: meeting,
  };
};

export const getMeetingDetailsFailure = (error: any): { type: string, payload: string } => {
  return {
    type: MeetingActions.FETCH_MEETINGDETAILS_FAILURE,
    payload: error,
  };
};

export const getUpcomingMeetingsByDate = (params: IGetUpcomingMeetingsByDateParams):
  { type: string, payload: IGetUpcomingMeetingsByDateParams } => {
  return {
    type: MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE,
    payload: params,
  };
};

export const getUpcomingMeetingsByDateSuccess = (meeting: MeetingModel[]) => {
  return {
    type: MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE_SUCCESS,
    payload: meeting,
  };
};

export const getUpcomingMeetingsByDateFailure = (error: any): { type: string, payload: string } => {
  return {
    type: MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE_FAILURE,
    payload: error,
  };
};

export const createMeeting = (profileId: string, meetingData: ICreateMeeting):
  { type: string, payload: { profileId: string, meetingData: ICreateMeeting } } => {
  return {
    type: MeetingActions.CREATE_MEETING,
    payload: {
      profileId,
      meetingData,
    },
  };
};

export const createMeetingSuccess = (meetingDetail: IMeeting) => {
  return {
    type: MeetingActions.CREATE_MEETING_SUCCESS,
    payload: meetingDetail,
  };
};

export const createMeetingFailure = (error: any): { type: string, payload: string } => {
  return {
    type: MeetingActions.CREATE_MEETING_FAILURE,
    payload: error,
  };
};
