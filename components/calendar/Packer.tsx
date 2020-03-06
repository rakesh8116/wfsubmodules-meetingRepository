import moment from 'moment';

const offset = 100;

function buildEvent(column: any, left: number, width: number, dayStart: number) {
  if (column && column.scheduled) {
    const startTime = moment(column.scheduled.startDateTime);
    const endTime = column.scheduled.endDateTime
      ? moment(column.scheduled.endDateTime)
      : startTime.clone().add(1, 'hour');
    const dayStartTime = startTime
      .clone()
      .hour(dayStart)
      .minute(0);
    const diffHours = startTime.diff(dayStartTime, 'hours', true);

    column.top = diffHours * offset;
    column.height = endTime.diff(startTime, 'hours', true) * offset;
    column.width = width;
    column.left = left;
    return column;
  }
}

function collision(a, b) {
  return a.scheduled.endDateTime > b.scheduled.startDateTime && a.scheduled.startDateTime < b.scheduled.endDateTime;
}

function expand(ev: any, column: number, columns: string | any[]) {
  let colSpan = 1;

  for (let i = column + 1; i < columns.length; i++) {
    const col = columns[i];
    for (let j = 0; j < col.length; j++) {
      const ev1 = col[j];
      if (collision(ev, ev1)) {
        return colSpan;
      }
    }
    colSpan++;
  }

  return colSpan;
}

function pack(columns: string | any[], width: number, calculatedEvents: any[], dayStart: number) {
  const colLength = columns.length;

  for (let i = 0; i < colLength; i++) {
    const col = columns[i];
    for (let j = 0; j < col.length; j++) {
      const colSpan = expand(col[j], i, columns);
      const L = (i / colLength) * width;
      const W = (width * colSpan) / colLength - 10;

      calculatedEvents.push(buildEvent(col[j], L, W, dayStart));
    }
  }
}

function populateEvents(events: any[], screenWidth: number, dayStart: number) {
  let lastEnd: number | null;
  let columns: any[];
  const calculatedEvents: any = [];

  events = events.map((ev: any, index: number) => ({...ev, index}))
    .sort((a, b) => {
      if (a.scheduled.startDateTime < b.scheduled.startDateTime) {
        return -1;
      }
      if (a.scheduled.startDateTime > b.scheduled.startDateTime) {
        return 1;
      }
      if (a.scheduled.endDateTime < b.scheduled.endDateTime) {
        return -1;
      }
      if (a.scheduled.endDateTime > b.scheduled.endDateTime) {
        return 1;
      }
      return 0;
    });

  columns = [];
  lastEnd = null;

  events.forEach((ev, index) => {
    if (lastEnd !== null && ev.scheduled.startDateTime >= lastEnd) {
      pack(columns, screenWidth, calculatedEvents, dayStart);
      columns = [];
      lastEnd = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!collision(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
    }

    if (lastEnd === null || ev.scheduled.endDateTime > lastEnd) {
      lastEnd = ev.scheduled.endDateTime;
    }
  });

  if (columns.length > 0) {
    pack(columns, screenWidth, calculatedEvents, dayStart);
  }
  return calculatedEvents;
}

export default populateEvents;
