import { MeetingModel } from '@models/Meetings';
import { MeetingActions } from '@modules/meetings/actions';

export interface IMeetingState {
  pending: MeetingModel[];
  upcomingMeetings: MeetingModel[];
  isLastMeetingRequestPage: boolean;
  isMeetingCreated: {
    status: string,
    message: string,
  };
  loaders: {
    pending: boolean;
    updateStatus: boolean;
    upcomingMeetings: boolean;
    seeAllData: boolean;
    createMeeting: boolean;
  };
  error: {
    pending: string | null;
    updateStatus: string | null;
    upcomingMeetings: string | null;
  };
}

interface IDetailedMeetingState {
  meetingDetails: MeetingModel | null;
  status: string;
  error: {
    meetingDetails: string | null;
  };
  loaders: {
    meetingDetails: boolean;
  };
}

const detailedMeetingsInitialState: IDetailedMeetingState = {
  meetingDetails: null,
  status: '',
  error: {
    meetingDetails: '',
  },
  loaders: {
    meetingDetails: true,
  },
}

interface IDetailedMeetingByDateState {
  meetingDetailsByDate: MeetingModel[] | null;
  status: string;
  error: {
    meetingDetailsByDate: string | null;
  };
  loaders: {
    meetingDetailsByDate: boolean;
  };
}

const detailedMeetingsByDateInitialState: IDetailedMeetingByDateState = {
  meetingDetailsByDate: null,
  status: '',
  error: {
    meetingDetailsByDate: '',
  },
  loaders: {
    meetingDetailsByDate: true,
  },
}

const initialState = {
  pending: [],
  upcomingMeetings: [],
  isLastMeetingRequestPage: false,
  isMeetingCreated: {
    status: '',
    message: '',
  },
  loaders: {
    pending: false,
    updateStatus: false,
    upcomingMeetings: true,
    seeAllData: true,
  },
  error: {
    pending: null,
    updateStatus: null,
    upcomingMeetings: null,
    createMeeting: null,
  },
};

export const meetingsReducer = (state: IMeetingState = initialState, action: {type: string, payload: any}) => {
  switch (action.type) {
    case MeetingActions.FETCH_PENDING:
      const {isRefresh} = action.payload;
      return {
        ...state,
        loaders: {...state.loaders, pending: true, seeAllData: true},
        pending: isRefresh ? [] : state.pending,
      };
    case MeetingActions.FETCH_PENDING_SUCCESS:
      return {
        ...state,
        pending: [...state.pending, ...action.payload],
        loaders: {...state.loaders, pending: false, seeAllData: false},
      };
    case MeetingActions.FETCH_PENDING_FAILURE:
      return {
        ...state,
        error: {...state.error, pending: action.payload},
        loaders: {...state.loaders, pending: false, seeAllData: false},
      };
    case MeetingActions.UPDATE_STATUS:
      return {
        ...state,
        loaders: {...state.loaders, updateStatus: true},
      };
    case MeetingActions.UPDATE_STATUS_SUCCESS:
      const pendingMeetings = state.pending.filter((meeting: MeetingModel) => {
        return meeting.getId() !== action.payload;
      });
      const upcoming = state.upcomingMeetings.filter((meeting: MeetingModel) => {
        return meeting.getId() !== action.payload;
      });
      return {
        ...state,
        pending: pendingMeetings,
        upcomingMeetings: upcoming,
        loaders: {...state.loaders, updateStatus: false},
      };
    case MeetingActions.UPDATE_STATUS_FAILURE:
      return {
        ...state,
        error: {...state.error, updateStatus: action.payload},
        loaders: {...state.loaders, updateStatus: false},
      };
    case MeetingActions.FETCH_UPCOMING:
      return {
        ...state,
        loaders: {...state.loaders, upcomingMeetings: true},
        upcomingMeetings: [],
      };
    case MeetingActions.FETCH_UPCOMING_SUCCESS:
      return {
        ...state,
        upcomingMeetings: action.payload,
        loaders: {...state.loaders, upcomingMeetings: false},
      };
    case MeetingActions.FETCH_UPCOMING_FAILURE:
      return {
        ...state,
        error: {...state.error, upcomingMeetings: action.payload},
        loaders: {...state.loaders, upcomingMeetings: false},
      };
    case MeetingActions.IS_INITIAL_CALL:
      return {
        ...state,
        isLastMeetingRequestPage: false,
        ['pending']: action.payload,
      };
    case MeetingActions.IS_LAST_PAGE_REACHED:
      return {
        ...state,
        isLastMeetingRequestPage: action.payload,
      };
    case MeetingActions.CREATE_MEETING:
      return {
        ...state,
        isMeetingCreated: {
          status: '',
          message: '',
        },
        loaders: {...state.loaders, createMeeting: true},
      };
    case MeetingActions.CREATE_MEETING_SUCCESS:
      return {
        ...state,
        isMeetingCreated: {
          status: 'SUCCESS',
          message: 'Meeting invite created successfully',
        },
        loaders: {...state.loaders, createMeeting: false},
      };
    case MeetingActions.CREATE_MEETING_FAILURE:
      return {
        ...state,
        isMeetingCreated: {
          status: 'FAILURE',
          message: action.payload,
        },
        loaders: {...state.loaders, createMeeting: false},
      };
    default:
      return state;
  }
};

export const detailedMeetingsReducer =
  (state: IDetailedMeetingState = detailedMeetingsInitialState, action: {type: string, payload: any }) => {
    switch (action.type) {
      case MeetingActions.FETCH_MEETINGDETAILS:
        return {
          ...state,
          loaders: {...state.loaders, meetingDetails: true},
        };
      case MeetingActions.FETCH_MEETINGDETAILS_SUCCESS:
        return {
          ...state,
          meetingDetails: action.payload,
          loaders: {...state.loaders, meetingDetails: false},
        };
      case MeetingActions.FETCH_MEETINGDETAILS_FAILURE:
        return {
          ...state,
          error: {...state.error, meetingDetails: action.payload},
          loaders: {...state.loaders, meetingDetails: false},
        };
      default:
        return state;
    }
  };

export const calendarReducer =
  (state: IDetailedMeetingByDateState = detailedMeetingsByDateInitialState, action: {type: string, payload: any }) => {
    switch (action.type) {
      case MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE:
        return {
          ...state,
          loaders: {...state.loaders, meetingDetailsByDate: true},
        };
      case MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE_SUCCESS:
        return {
          ...state,
          meetingDetailsByDate: action.payload,
          loaders: {...state.loaders, meetingDetailsByDate: false},
        };
      case MeetingActions.FETCH_UPCOMING_MEETINGS_BY_DATE_FAILURE:
        return {
          ...state,
          error: {...state.error, meetingDetailsByDate: action.payload},
          loaders: {...state.loaders, meetingDetailsByDate: false},
        };
      default:
        return state;
    }
};
